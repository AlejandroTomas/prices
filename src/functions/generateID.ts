import { nanoid } from "nanoid";

export const generarUUID = (length = 5) => {
  return nanoid(length);
};
