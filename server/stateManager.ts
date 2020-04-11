import { Socket } from "dgram";

export const ts:number = 0;

export class State {
    public static timeStamp: number = 0;
    public static items: Map<string, RenderItemBase> = new Map<string,RenderItemBase>()
}

export class RenderItemBase {
    name: string;
    action: string;
    rotation: number;
    scaleX: number;
    scaleY: number;
    x: number;
    y: number;
    imgSrc: string;
    timeStamp:number;
}

export function AddToState(item:RenderItemBase, socket:any) {
    console.log("Got state (" + item.action + ") for" + item.name);
    console.log(JSON.stringify(item))

    // give the item a 'timestamp' to order updates as they were received by the server. This may have no practical purpose.
    item.timeStamp = State.timeStamp++;
    State.items.set(item.name, item);
    
    console.log("state has " + State.items.size + " items. at ts " + State.timeStamp);
    
    // Send to all except originator
    socket.broadcast.emit("news", "state has " + State.items.size + " items.");    
    socket.broadcast.emit("stateUpdate", item);    

    // Send back to originator.
    //socket.emit("BCASTstate has " + State.items.size + " items.");
}