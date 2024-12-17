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
		try {
			var infractionsEmbed = new EmbedBuilder()
				.setTitle(client.capitalize(member.user.username) + " Infractions")
				.setColor("#2b2d31")
				.addFields(
					infractions.map((infraction) => {
						const daysUntilExpiration = Math.ceil(
							(new Date(infraction.expiresAt).getTime() - Date.now()) /
								(1000 * 60 * 60 * 24)
						);
						return {
							name: `Infraction #${infraction.id} (Expires in ${daysUntilExpiration} days)`,
							value: `Reason: ${infraction.reason}`,
						};
					})
				);

			commandOptions.channel.send({ embeds: [infractionsEmbed] });
		} catch (error) {
			commandOptions.channel.send("Could not ban user");
		}
	},
};
