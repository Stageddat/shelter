import { CommandInteraction } from "discord.js";

export interface CommandData {
    name: string;
}

export interface Command {
    data: CommandData;
    execute: (interaction: CommandInteraction) => void;
}
