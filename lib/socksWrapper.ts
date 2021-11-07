import { Socket } from "net";
import { EventEmitter } from "stream";

class SocksSocket {
    private readonly emitter = new EventEmitter();

   constructor(
       private readonly socket: Socket,
   ) {} 
}