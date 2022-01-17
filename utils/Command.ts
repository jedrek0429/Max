import { ApplicationCommandData, Message, CommandInteraction } from "discord.js";

export default interface Command {
  data: ApplicationCommandData;
  run: (interaction: CommandInteraction) => Promise<void>;
}