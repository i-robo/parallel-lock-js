"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var QueueItem = function QueueItem(data) {
    _classCallCheck(this, QueueItem);

    this.data = data;
};

exports.QueueItem = QueueItem;

var Queue = function () {
    function Queue() {
        _classCallCheck(this, Queue);

        this.headItem = null;
        this.tailItem = null;
    }

    _createClass(Queue, [{
        key: "enqueue",
        value: function enqueue(data) {
            var itemToInsert = new QueueItem(data);
            if (!this.headItem) {
                this.headItem = itemToInsert;
                this.tailItem = itemToInsert;
            } else {
                this.tailItem.next = itemToInsert;
                this.tailItem = itemToInsert;
            }
        }
    }, {
        key: "dequeue",
        value: function dequeue() {
            if (!this.headItem) {
                return null;
            }
            var toReturn = this.headItem.data;
            this.headItem = this.headItem.next;
            return toReturn;
        }
    }]);

    return Queue;
}();

exports.Queue = Queue;