import { EmbedBuilder } from "discord.js"

export const testEmbed = new EmbedBuilder()
    .setColor(0xffbc00)
    .setTitle('testing response')
    .setDescription(`you shouldnt see this...`)

export const errorEmbed = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle('something has exploded!')
    .setDescription(`it seems something went wrong:c... its not your fault!\nplease try again later or contact support`)