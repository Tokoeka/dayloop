import { Quest, Task } from "grimoire-kolmafia";
import {
  canInteract,
  getCampground,
  handlingChoice,
  myAdventures,
  myInebriety,
  myPath,
  pvpAttacksLeft,
  retrieveItem,
  runChoice,
  use,
} from "kolmafia";
import { args, external, tapped } from "./util";
import { $item, $items, $path, ascend, have, Lifestyle } from "libram";

const smolPath = $path`A Shrunken Adventurer am I`;

export const smol: Quest<Task> = {
  name: "smol",
  tasks: [
    ...$items`Deep Dish of Legend, Calzone of Legend, Pizza of Legend`.map((i) => ({
      name: `prep ${i}`,
      ready: () => canInteract(),
      completed: () => have(i),
      do: () => retrieveItem(i),
    })),
    {
      name: "smol gash",
      prepare: (): void => {
        if (myAdventures() > 0 || pvpAttacksLeft() > 0) {
          throw `You shouldn't be ascending with ${myAdventures()} adventures and ${pvpAttacksLeft()} fites left!`;
        }
        const seeds = $item`packet of rock seeds`;
        if (getCampground()[`${seeds}`] === undefined) {
          use(seeds);
        }
      },
      ready: () => tapped(true) && args.ascend,
      completed: () => !canInteract() && myPath() === smolPath,
      do: (): void => {
        ascend({
          path: smolPath,
          playerClass: args.class,
          lifestyle: Lifestyle.softcore,
          moon: "knoll",
          pet: $item`astral belt`,
          consumable: $item`astral six-pack`,
        });
        while (handlingChoice()) runChoice(1);
      },
    },
    {
      name: "smol",
      ready: () => myPath() === smolPath && myInebriety() < 2,
      completed: () => canInteract(),
      do: () => external("autoscend"),
    },
  ],
};
