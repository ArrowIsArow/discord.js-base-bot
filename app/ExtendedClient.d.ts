import { Client } from 'discord.js';

declare global {
    export interface ExtendedClient extends Client {};
}

export {}