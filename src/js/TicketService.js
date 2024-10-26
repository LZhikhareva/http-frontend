/**
 *  Класс для связи с сервером.
 *  Содержит методы для отправки запросов на сервер и получения ответов
 * */
export default class TicketService {
  async list() {
    try {
      const response = await fetch('https://http-backend-dpr8.onrender.com?method=allTickets');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching tickets:', error);
      return [];
    }
  }

  async getById(id) {
    try {
      const response = await fetch(`https://http-backend-dpr8.onrender.com?method=ticketById&id=${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching ticket with ID ${id}:`, error);
      return null;
    }
  }

  async create(ticket) {
    try {
      const response = await fetch('https://http-backend-dpr8.onrender.com?method=createTicket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticket),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating ticket:', error);
      return null;
    }
  }

  async deleteById(id) {
    try {
      const response = await fetch(`https://http-backend-dpr8.onrender.com?method=deleteById&id=${id}`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (error) {
      console.error(`Error deleting ticket with ID ${id}:`, error);
      return false;
    }
  }

  async updateById(id, ticket) {
    try {
      const response = await fetch(`https://http-backend-dpr8.onrender.com?method=updateById&id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticket),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error updating ticket with ID ${id}:`, error);
      return null;
    }
  }
}
