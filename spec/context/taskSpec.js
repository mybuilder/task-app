import expect from 'expect.js';
import {setup} from 'env';

describe('Tasks', () => {
    let env;

    beforeEach(() => { env = setup() });

    const fetchFirstTask = () => env.taskStore.all()[0];
    const fetchTaskById = (id) => env.taskStore.all().filter(t => t.id === id)[0];
    const givenTaskInStore = (id, message) => env.taskServerActions.refresh({ id, message });

    it('should add supplied task to store', () => {
        givenTaskInStore(123, 'Sample Message');

        expect(env.taskStore.all().length).to.be.eql(1);
        
        const task = fetchTaskById(123);
        expect(task).to.have.property('id', 123);
        expect(task).to.have.property('message', 'Sample Message');
    });

    it('should update task in store', () => {
        givenTaskInStore(123, 'Sample Message');
        givenTaskInStore(123, 'Updated Message');

        expect(fetchTaskById(123)).to.have.property('message', 'Updated Message');
    });

    it('should add created task to store', () => {
        env.taskServerActions.add(321, { id: 123, message: 'Sample Message' });

        const task = fetchTaskById(123);
        expect(task).to.have.property('id', 123);
        expect(task).to.have.property('message', 'Sample Message');
    });

    it('should remove task from store', () => {
        givenTaskInStore(123, 'Sample Message');

        env.taskServerActions.remove(123);

        expect(env.taskStore.all().length).to.be.eql(0);
    });

    it('should set task into edit mode', () => {
        givenTaskInStore(123, 'Sample Message');

        env.taskClientActions.editMode(123);

        expect(fetchTaskById(123)).to.have.property('inEditMode', true);
    });

    it('should set task into view mode', () => {
        givenTaskInStore(123, 'Sample Message');

        env.taskClientActions.viewMode(123);

        expect(fetchTaskById(123)).to.have.property('inEditMode', false);
    });

    it('should call api when fetching all tasks', () => {
        let called = false;
        env.taskApi.fetchAll = () => called = true;

        env.taskClientActions.fetchAll();

        expect(called).to.be.eql(true);
    });

    it('should insert pending addition', () => {
        let called = false;
        env.taskApi.add = () => called = true;

        env.taskClientActions.add('Sample Message');

        const task = fetchFirstTask();
        expect(task).to.have.property('id');
        expect(task).to.have.property('message', 'Sample Message');
        expect(task).to.have.property('pendingStatus', 'adding');
        expect(called).to.be.eql(true);
    });   

    it('should insert pending update', () => {
        givenTaskInStore(123, 'Sample Message');

        let called = false;
        env.taskApi.update = () => called = true;

        env.taskClientActions.update(123, 'Updated Message');

        const task = fetchTaskById(123);
        expect(task).to.have.property('message', 'Updated Message');
        expect(task).to.have.property('pendingStatus', 'updating');
        expect(called).to.be.eql(true);
    });

    it('should insert pending removal', () => {
        givenTaskInStore(123, 'Sample Message');

        let called = false;
        env.taskApi.remove = () => called = true;

        env.taskClientActions.remove(123);
        expect(fetchTaskById(123)).to.have.property('pendingStatus', 'removing');
        expect(called).to.be.eql(true);
    });
});
