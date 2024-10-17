import { sleep } from 'bun';
import { Client} from 'discord.js-selfbot-v13'
import { randomIntegerBetween,randomSeeded  } from "@std/random";

const prng = randomSeeded(1n);

// txt message read
const messagePath ="./message.txt"
const messageFile = Bun.file(messagePath)
const message = await messageFile.text()
const client = new Client();

// txt id's to send 
const idPath = "./ids.txt"
const idFile = Bun.file(idPath)
const ids = await idFile.text()
const ArrayIds: string[] = ids.split(',')

//Random Shuffle function I found on stackOverflow :P
const getShuffledArr = (arr: string[]) => {
  const newArr = arr.slice()
  for (let i = newArr.length - 1; i > 0; i--) {
      const rand = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
  }
  return newArr
};

client.on('ready', async () => {
  // Shuffle the array of ids so its no the same everytime
  const ShuffleArr = getShuffledArr(ArrayIds);

  const promises = ShuffleArr.map(async id => {
    const ch = client.channels.cache.get(id);
    //random cooldown to prevet flaging
    await sleep(randomIntegerBetween(20000, 30000, { prng }));
    ch.send(message);    
  });

  await Promise.all(promises);

  console.log("Done Spamming Channels :3");
  process.exit(0)
});

client.login(Bun.env.TOKEN);