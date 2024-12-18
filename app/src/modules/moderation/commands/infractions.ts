import { KiwiClient } from "@/client";
import { CommandOptions, ConfigOptionTypes, PrefixCommand } from "@/types/command";
import { Message, GuildMember, EmbedBuilder, PermissionFlagsBits } from "discord.js";

export const InfractionsPrefix: PrefixCommand = {
	config: {
		name: "infractions",
		description: "Get a users infractions",
		aliases: ["infs"],
		autoDelete: false,
		defaultPermissions: [],
		options: [
			{
				name: "member",
				type: ConfigOptionTypes.MEMBER,
				defaultSelf: true,
			},
		],
	},

	async execute(
		client: KiwiClient,
		message: Message,
		commandOptions: CommandOptions,
		member: GuildMember
	) {
		var infractions = await client.db.getInfractions(message.guild.id, member.id);
		if (!infractions.length) {
			commandOptions.channel.send({
				content: "This user has no infractions",
			});
			return;
		}

		var infractionsEmbed = new EmbedBuilder()
			.setTitle(client.capitalize(member.user.username) + "'s Infractions")
			.setColor(client.Colors.primary)
			.addFields(
				infractions.map((infraction) => {
					var daysUntilExpiration = Math.ceil(
						(new Date(infraction.expiresAt).getTime() - Date.now()) /
							(1000 * 60 * 60 * 24)
					);
					return {
						name: `Infraction #${infraction.infractionId} (Expires in ${daysUntilExpiration} days)`,
						value: `Reason: ${infraction.reason}`,
					};
				})
			);

		commandOptions.channel.send({ embeds: [infractionsEmbed] });
	},
};
