import { Message } from 'discord.js';

export const getUserId = async (text: string, message: Message) => {
	if (text.startsWith('<@') && text.endsWith('>')) {
		return text.slice(2, -1);
	}

	if (/^\d+$/.test(text)) {
		return text;
	}

	if (text === 'u' && message.reference) {
		const referencedMessage = await message.channel.messages.fetch(
			message.reference.messageId
		);
		if (referencedMessage) {
			return referencedMessage.author.id;
		}
	}

	return null;
};
