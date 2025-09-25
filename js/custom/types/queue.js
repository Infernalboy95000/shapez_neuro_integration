// Straight copy from:
// https://www.geeksforgeeks.org/javascript/implementation-queue-javascript/

import { DataNode } from "./dataNode";

export class Queue {
	constructor() {
		this.front = null;
		this.rear = null;
		this.size = 0;
	}

	enqueue(value) {
		const newNode = new DataNode(value);
		if (this.isEmpty()) {
			this.front = newNode;
			this.rear = newNode;
		} else {
			this.rear.next = newNode;
			this.rear = newNode;
		}
		this.size++;
	}

	dequeue() {
		if (this.isEmpty()) {
			return null; 
		}
		const removedNode = this.front;
		this.front = this.front.next;
		if (this.front === null) {
			this.rear = null;
		}
		this.size--;
		return removedNode.data;
	}

	peek() {
		if (this.isEmpty()) {
			return null;
		}
		return this.front.data;
	}

	isEmpty() {
		return this.size === 0;
	}

	getSize() {
		return this.size;
	}

	clear() {
		this.front = null;
		this.rear = null;
		this.size = 0;
	}
}