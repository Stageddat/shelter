import { Client, Collection, GatewayIntentBits } from "discord.js";
import { Command } from "../types/command";

export class CustomClient extends Client {
    public commands: Collection<string, Command>;

    constructor() {
        super({ intents: [GatewayIntentBits.Guilds] });
        this.commands = new Collection<string, Command>();
    }
}
