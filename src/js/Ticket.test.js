import Ticket from './Ticket'; // Предполагаем, что ваш класс Ticket находится в файле ticket.js
describe('Ticket', () => {
  it('should create a ticket with correct properties', () => {
    const ticketData = {
      id: 1,
      name: 'Test Ticket',
      description: 'This is a test ticket.',
      status: 'open',
      created: Date.now(),
    };
    const ticket = new Ticket(ticketData);
    expect(ticket.id).toBe(1);
    expect(ticket.name).toBe('Test Ticket');
    expect(ticket.description).toBe('This is a test ticket.');
    expect(ticket.status).toBe('open');
    expect(ticket.created).toBe(ticketData.created);
  });
});