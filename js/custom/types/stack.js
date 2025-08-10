// Straight copy from:
// https://www.geeksforgeeks.org/javascript/implementation-stack-javascript/

import { DataNode } from "./dataNode";

export class Stack {
	constructor() {
		this.top = null;
		this.size = 0;
	}

	push(value) {
		const newNode = new DataNode(value);
		newNode.next = this.top; 
		this.top = newNode; 
		this.size++;
	}

	pop() {
		if (this.isEmpty()) {
			return null;
		}
		const poppedValue = this.top.data;
		this.top = this.top.next;
		this.size--;
		return poppedValue;
	}

	peek() {
		return this.isEmpty() ? null : this.top.data;
	}

	isEmpty() {
		return this.size === 0;
	}

	getSize() {
		return this.size;
	}

	clear() {
		this.top = null;
		this.size = 0;
	}
}