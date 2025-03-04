import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import prisma from "@/lib/prisma";
import { registerController } from "@/controllers/register";
import { errorEmbed } from "@/views/general";
import { Logger } from "@/lib/logger";

const setupCommand = {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("start your journey!"),
    async execute(interaction: CommandInteraction) {
        const response = await registerController.newUser({ userID: interaction.user.id })
        try {
            if (response) {
                return interaction.reply({ embeds: [response] });
            }
            return interaction.reply({ embeds: [errorEmbed] })
        }
        catch (error) {
            Logger.error(error)
        }
    },
};

export default setupCommand;