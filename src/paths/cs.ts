import { Quest, Task } from "grimoire-kolmafia";
import { get } from "libram";
import { args, cliExecuteThrow, external, tapped } from "../util";
import { canInteract, myAdventures, myAscensions, pvpAttacksLeft } from "kolmafia";

export const cs: Quest<Task> = {
  name: "cs",
  tasks: [
    {
      name: "hccsAscend",
      prepare: (): void => {
        if (myAdventures() > 0 || pvpAttacksLeft() > 0) {
          throw `You shouldn't be ascending with ${myAdventures()} adventures and ${pvpAttacksLeft()} fites left!`;
        }
      },
      ready: () => tapped(true) && args.ascend,
      completed: () => get("ascensionsToday") > 0,
      do: () => external("hccsAscend", `${args.lifestyle}`), // { key: "class", value: `${args.class}` }
    },
    {
      name: "asmohccs",
      ready: () => get("ascensionsToday") === 1,
      completed: () => get("questL13Final") === "finished",
      do: () => external("asmohccs"),
    },

    {
      name: "hagnk",
      ready: () => canInteract(),
      completed: () => get("lastEmptiedStorage") === myAscensions(),
      do: () => cliExecuteThrow("hagnk all"),
      post: () => cliExecuteThrow("breakfast"),
    },
  ],
  completed: () => get("ascensionsToday") === 1 && get("questL13Final") === "finished",
};
