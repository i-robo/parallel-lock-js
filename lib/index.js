"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator.throw(value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var uuid = require('node-uuid');
var sleep = require('sleep-promise');
var Queue_1 = require('./Queue');
var promiseDefer_1 = require('./promiseDefer');

var TimeoutError = function (_Error) {
    _inherits(TimeoutError, _Error);

    function TimeoutError(taskName) {
        _classCallCheck(this, TimeoutError);

        return _possibleConstructorReturn(this, (TimeoutError.__proto__ || Object.getPrototypeOf(TimeoutError)).call(this, taskName + ' timed out!'));
    }

    return TimeoutError;
}(Error);

exports.TimeoutError = TimeoutError;

var ParallelLockRepo = function () {
    function ParallelLockRepo(options) {
        _classCallCheck(this, ParallelLockRepo);

        var _options = options || {
            maxParallels: 1,
            defaultTimeoutMs: 100000
        };
        this.taskQueue = new Queue_1.Queue();
        this.maxParallels = _options.maxParallels;
        this.runtimeTimeouts = {};
        this.runtimeTimeoutErrors = {};
        this.parallelCount = 0;
        this.defaultTimeoutMs = _options.defaultTimeoutMs;
    }

    _createClass(ParallelLockRepo, [{
        key: 'acquireLock',
        value: function acquireLock(options) {
            return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee() {
                var _ref, taskTimeoutMs, taskName, defer, id, timeoutMs, task;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _ref = options || {
                                    taskTimeoutMs: null, taskName: null
                                }, taskTimeoutMs = _ref.taskTimeoutMs, taskName = _ref.taskName;
                                defer = promiseDefer_1.promiseDefer();
                                id = uuid.v4();
                                timeoutMs = taskTimeoutMs || this.defaultTimeoutMs;
                                task = {
                                    defer: defer, id: id, timeoutMs: timeoutMs
                                };

                                this.runtimeTimeoutErrors[task.id] = new TimeoutError(taskName);
                                if (this.parallelCount < this.maxParallels) {
                                    this.runTask(task);
                                } else {
                                    this.taskQueue.enqueue(task);
                                }
                                _context.next = 9;
                                return task.defer;

                            case 9:
                                return _context.abrupt('return', task);

                            case 10:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));
        }
    }, {
        key: 'runTask',
        value: function runTask(task) {
            var _this2 = this;

            var timeoutDefer = promiseDefer_1.promiseDefer();
            this.runtimeTimeouts[task.id] = timeoutDefer;
            this.parallelCount++;
            this.runtimeTimeouts[task.id].promise.catch(function (error) {
                throw error;
            });
            sleep(task.timeoutMs).then(function () {
                timeoutDefer.reject(_this2.runtimeTimeoutErrors[task.id]);
            });
            task.defer.resolve();
        }
    }, {
        key: 'releaseLock',
        value: function releaseLock(task) {
            // delete this.runtimeTimeouts[task.id];
            this.parallelCount--;
            if (this.parallelCount < this.maxParallels) {
                var taskToRun = this.taskQueue.dequeue();
                if (taskToRun) {
                    this.runTask(taskToRun);
                }
            }
            try {
                this.runtimeTimeouts[task.id].resolve();
            } catch (e) {
                console.error('releaseLock error: ' + JSON.stringify(task));
                console.error(e);
                throw e;
            }
        }
    }]);

    return ParallelLockRepo;
}();

exports.ParallelLockRepo = ParallelLockRepo;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParallelLockRepo;