import { Message } from 'discord.js';
import { KiwiClient } from '@/client';
import { Event, EventList } from '@/types/event';

/**
 * @type {Event}
 */
export const MessageCreate: Event = {
	name: EventList.MessageCreate,

	/**
	 * @param {KiwiClient} client
	 * @param {Guild} guild
	 */
	async execute(client: KiwiClient, message: Message) {
		console.log('messageCreate');
		let guildConfig = await client.db.getGuildConfig(message.guild.id);
		let xpGain = [95, 100, 105][Math.floor(Math.random() * 3)];
		console.log(xpGain);

		let userLevel = await client.db.getUserLevel(
			message.guild.id,
			message.author.id
		);
		if (!userLevel) {
			userLevel = await client.db.createUserLevel(
				message.guild.id,
				message.author.id,
				message.author.username
			);
		}
		console.log(userLevel);

		if (new Date() < new Date(userLevel.lastUpdated.getTime() + 60000))
			return;
		userLevel.xp += xpGain;
		let neededXp =
			(await client.calculateXp(userLevel.level + 1)) - userLevel.xp;

		if (neededXp <= 0) {
			userLevel.level++;

			if (guildConfig?.levelUpMessage) {
				let channel;
				if (guildConfig.levelUpChannel) {
					channel = await message.guild.channels.fetch(
						guildConfig.levelUpChannel
					);
				} else {
					channel = message.channel;
				}

				channel.send(
					guildConfig.levelUpMessage
						.replace('{userMention}', `<@${message.author.id}>`)
						.replace('{userName}', message.author.username)
						.replace('{userId}', message.author.id.toString())
						.replace('{level}', userLevel.level.toString())
						.replace('{xp}', userLevel.xp.toString())
				);
			}

			if (guildConfig?.levelReward) {
				let closestReward = Object.keys(guildConfig.levelReward)
					.map(Number)
					.filter((level) => level <= userLevel.level)
					.sort((a, b) => b - a)[0];

				if (closestReward) {
					let newRoleId = guildConfig.levelReward[closestReward];
					Object.values(guildConfig.levelReward).forEach(
						async (roleId) => {
							if (roleId === newRoleId) return;
							if (message.member?.roles.cache.has(roleId)) {
								message.member?.roles
									.remove(roleId)
									.catch(console.error);
							}
						}
					);
					message.member?.roles.add(newRoleId).catch(console.error);
				}
			}
		}
		await client.db.saveUserLevel(userLevel);
	},
};
