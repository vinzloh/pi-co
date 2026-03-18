// https://github.com/dmmulroy/.dotfiles/blob/eb569d731584893dc5245502a5eeaf34a7e4c4b8/home/.pi/agent/extensions/whimsical.ts
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";

const messages = [
  // Famous People (25)
  "Stay hungry, stay foolish... — Steve Jobs",
  "Carpe diem... — Horace",
  "Be the change... — Gandhi",
  "I think, therefore I am... — Descartes",
  "E=mc²... — Einstein",
  "Float like a butterfly... — Muhammad Ali",
  "The only way to do great work... — Steve Jobs",
  "Imagination is more important... — Einstein",
  "That's one small step... — Neil Armstrong",
  "Houston, we have a problem... — Jim Lovell",
  "I have a dream... — MLK",
  "Yes we can... — Obama",
  "Be yourself... — Oscar Wilde",
  "To be or not to be... — Shakespeare",
  "All the world's a stage... — Shakespeare",
  "The journey of a thousand miles... — Lao Tzu",
  "That which does not kill us... — Nietzsche",
  "You miss 100% of the shots... — Wayne Gretzky",
  "It always seems impossible... — Nelson Mandela",
  "Do not go gentle... — Dylan Thomas",
  "Fortune favors the bold... — Virgil",
  "We are what we repeatedly do... — Aristotle",
  "I came, I saw, I conquered... — Caesar",
  "Knowledge is power... — Francis Bacon",
  "Winter is coming... — George R.R. Martin",

  // Movies (25)
  "May the Force be with you... — Star Wars",
  "I'll be back... — Terminator",
  "Just keep swimming... — Finding Nemo",
  "To infinity and beyond... — Toy Story",
  "Hakuna Matata... — Lion King",
  "I am Groot... — Guardians of the Galaxy",
  "I am inevitable... — Avengers: Endgame",
  "I am Iron Man... — Avengers: Endgame",
  "Avengers, assemble... — Avengers: Endgame",
  "Why so serious... — The Dark Knight",
  "Here's looking at you, kid... — Casablanca",
  "There's no place like home... — Wizard of Oz",
  "Life is like a box of chocolates... — Forrest Gump",
  "Hasta la vista, baby... — Terminator 2",
  "Yippee-ki-yay... — Die Hard",
  "Say hello to my little friend... — Scarface",
  "Live long and prosper... — Star Trek",
  "Beam me up... — Star Trek",
  "I see dead people... — The Sixth Sense",
  "You can't handle the truth... — A Few Good Men",
  "Show me the money... — Jerry Maguire",
  "I'm the king of the world... — Titanic",
  "Wax on, wax off... — The Karate Kid",
  "You're gonna need a bigger boat... — Jaws",
  "Keep the change, ya filthy animal... — Home Alone 2",

  // Anime (25)
  "Believe it... — Naruto",
  "I'm gonna be King of the Pirates... — One Piece",
  "Plus Ultra... — My Hero Academia",
  "Omae wa mou shindeiru... — Fist of the North Star",
  "It's over 9000... — Dragon Ball Z",
  "Yare yare daze... — JoJo's Bizarre Adventure",
  "Muda muda muda... — JoJo's Bizarre Adventure",
  "ORA ORA ORA... — JoJo's Bizarre Adventure",
  "Your next line is... — JoJo's Bizarre Adventure",
  "Bankai... — Bleach",
  "I am Atomic... — The Eminence in Shadow",
  "It can't be helped... — Anime",
  "NANI... — Anime",
  "Sugoi... — Anime",
  "Itadakimasu... — Anime",
  "I'm gonna take a potato chip... — Death Note",
  "Pikachu, I choose you... — Pokemon",
  "Gotta catch 'em all... — Pokemon",
  "Team Rocket blasting off again... — Pokemon",
  "Super Saiyan... — Dragon Ball Z",
  "Kamehameha... — Dragon Ball Z",
  "Shinzo wo sasageyo... — Attack on Titan",
  "Tatakae... — Attack on Titan",
  "Oppai... — One Punch Man",
  "OK... — One Punch Man",

  // Games (25)
  "The cake is a lie... — Portal",
  "A winner is you... — Pro Wrestling",
  "Do a barrel roll... — Star Fox 64",
  "It's dangerous to go alone... — Zelda",
  "I used to be an adventurer... — Skyrim",
  "Fus Ro Dah... — Skyrim",
  "Would you kindly... — BioShock",
  "War never changes... — Fallout",
  "Snake? Snake... — Metal Gear Solid",
  "Finish him... — Mortal Kombat",
  "Get over here... — Mortal Kombat",
  "Hadouken... — Street Fighter",
  "Shoryuken... — Street Fighter",
  "Fatality... — Mortal Kombat",
  "Praise the sun... — Dark Souls",
  "Git gud... — Dark Souls",
  "All your base are belong to us... — Zero Wing",
  "The princess is in another castle... — Super Mario",
  "All you had to do... — GTA: San Andreas",
  "I need a weapon... — Halo",
  "Press F to pay respects... — Call of Duty",
  "The numbers, Mason... — Black Ops",
  "Stop right there... — Skyrim",
  "The right man in the wrong place... — Half-Life 2",
  "Rise and shine, Mr. Freeman... — Half-Life 2",
];

function pickRandom(): string {
  return messages[Math.floor(Math.random() * messages.length)]!;
}

export default function (pi: ExtensionAPI) {
  pi.on("turn_start", async (_event, ctx) => {
    ctx.ui.setWorkingMessage(pickRandom());
  });

  pi.on("turn_end", async (_event, ctx) => {
    ctx.ui.setWorkingMessage(); // Reset for next time
  });
}
