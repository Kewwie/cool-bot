import { Message } from 'discord.js';
import { KiwiClient } from '@/client';
import { Event, EventList } from '@/types/event';

export const MessageCreate: Event = {
	name: EventList.MessageCreate,

	async getGuildId(message: Message) {
		return message.guild.id;
	},

	async execute(client: KiwiClient, message: Message) {
		let guildConfig = await client.db.getGuildConfig(message.guild.id);
		let xpGain = [95, 100, 105][Math.floor(Math.random() * 3)];

		let userLevel = await client.db.getUserLevel(
			message.guild.id,
			message.author.id
		);

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

			if (guildConfig?.levelRewards) {
				let closestReward = Object.keys(guildConfig.levelRewards)
					.map(Number)
					.filter((level) => level <= userLevel.level)
					.sort((a, b) => b - a)[0];

				if (closestReward) {
					let newReward = guildConfig.levelRewards[closestReward];
					let newRewardKey = closestReward.toString();
					guildConfig.levelRewards;
					for (var [key, value] of Object.entries(
						guildConfig.levelRewards
					)) {
						if (newRewardKey === key) continue;
						if (
							message.member?.roles.cache.has(key) &&
							!value.permanent
						) {
							message.member?.roles
								.remove(key)
								.catch(console.error);
						}
					}
					message.member?.roles
						.add(newRewardKey)
						.catch(console.error);
				}
			}
		}
		await client.db.saveUserLevel(userLevel);
	},
};
