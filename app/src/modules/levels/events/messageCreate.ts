import { Message } from "discord.js";
import { KiwiClient } from "@/client";
import { Event, EventList } from "@/types/event";

export const MessageCreate: Event = {
    name: EventList.MessageCreate,

    async getGuildId(message: Message) {
        return message.guild.id;
    },

    async execute(client: KiwiClient, message: Message) {
        let guildConfig = await client.db.getGuildConfig(message.guild.id);
        let xpGain = [145, 150, 155][Math.floor(Math.random() * 3)];

        let userLevel = await client.db.getUserLevel(message.guild.id, message.author.id);

        if (new Date() < new Date(userLevel.lastUpdated.getTime() + 60000)) return;
        userLevel.xp += xpGain;
        let neededXp = (await client.calculateXp(userLevel.level + 1)) - userLevel.xp;

        if (neededXp <= 0) {
            userLevel.level++;

            if (guildConfig?.levelUpMessage) {
                let channel;
                if (guildConfig.levelUpChannel) {
                    channel = await message.guild.channels.fetch(guildConfig.levelUpChannel);
                } else {
                    channel = message.channel;
                }

                channel.send({
                    content: guildConfig.levelUpMessage
                        .replace("{userMention}", `<@${message.author.id}>`)
                        .replace("{userName}", message.author.username)
                        .replace("{userId}", message.author.id.toString())
                        .replace("{level}", userLevel.level.toString())
                        .replace("{xp}", userLevel.xp.toString()),
                    allowMentions: { parse: [] },
                });
            }

            if (guildConfig?.levelRewards) {
                let closestReward = guildConfig.levelRewards
                    .filter((reward) => reward.level <= userLevel.level)
                    .sort((a, b) => b.level - a.level)[0];

                if (closestReward) {
                    guildConfig.levelRewards;
                    for (var reward of guildConfig.levelRewards) {
                        if (closestReward.roleId === reward.roleId) continue;
                        if (message.member?.roles.cache.has(reward.roleId) && !reward.permanent) {
                            message.member?.roles.remove(reward.roleId).catch(console.error);
                        }
                    }
                    message.member?.roles.add(closestReward.roleId).catch(console.error);
                }
            }
        }
        await client.db.saveUserLevel(userLevel);
    },
};
