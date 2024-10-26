/**
 *  Основной класс приложения
 * */
import close from '../../img/close1.png';
import edit from '../../img/edit.png';

export default class HelpDesk {
  constructor(container, ticketService) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('This is not HTML element!');
    }
    this.container = container;
    this.ticketService = ticketService;
    this.modal = undefined;
    const addTicketButton = document.createElement('button');
    addTicketButton.classList.add('add-ticket');
    addTicketButton.textContent = 'Добавить тикет';
    addTicketButton.addEventListener('click', () => {
      this.showModal();
    });
    document.body.appendChild(addTicketButton);
    this.ticketList = document.createElement('ul');
    this.ticketList.classList.add('ticket-list');
    document.body.appendChild(this.ticketList);
  }

  init() {
    console.info('init');
    this.ticketService.list().then((tickets) => {
      this.renderTickets(tickets);
    });
  }

  showModal() {
    if (!this.modal) {
      this.modal = document.createElement('div');
      this.modal.classList.add('modal');
      this.modal.innerHTML = `
            <div class="modal-content">
              <h2>Добавить тикет</h2>
              <form id="new-ticket-form" class="ticket-form">
                <label for="ticket-name">Краткое описание:</label>
                <input type="text" id="ticket-name" name="name" required>
                <label for="ticket-description">Подробное описание:</label>
                <textarea id="ticket-description" name="description"></textarea>
                <div class="buttons-container">
                <button type="button" class="cancel">Отмена</button>
                <button type="submit" class="ok">ОК</button>
                </div>
              </form>
            </div>
          `;
      this.container.appendChild(this.modal);
      const cancelButton = this.modal.querySelector('.cancel');
      cancelButton.addEventListener('click', () => {
        this.container.removeChild(this.modal);
        this.modal = null;
      });
      const newTicketForm = this.modal.querySelector('#new-ticket-form');
      newTicketForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(newTicketForm);
        const ticketData = {
          name: formData.get('name'),
          description: formData.get('description'),
          created: Date.now(),
        };
        this.ticketService.create(ticketData).then(() => {
          this.container.removeChild(this.modal);
          this.modal = null;
          this.ticketService.list().then((tickets) => {
            this.renderTickets(tickets);
          });
        });
      });
    }
  }

  renderTickets(tickets) {
    this.ticketList.innerHTML = '';
    tickets.forEach((ticket) => {
      const ticketItem = document.createElement('li');
      ticketItem.classList.add('ticket');
      const timestamp = ticket.created;
      const date = new Date(timestamp);
      const formattedDate = date.toLocaleString();
      ticketItem.innerHTML = `
            <div class="circle" data-id="${ticket.id}"></div>
            <h3 class="ticket-title">${ticket.name}</h3>
            <div class="timestamp">${formattedDate}</div>
            <p class="ticket-description">${ticket.description}</p>
            <button class="edit" data-id="${ticket.id}"><img class="btn-img" src="${edit}" alt="Редактировать"></button>
            <button class="delete" data-id="${ticket.id}"><img class="btn-img" src="${close}" alt="Закрыть"></button>
          `;
      ticketItem.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete')
          || event.target.classList.contains('edit')
          || event.target.classList.contains('circle')) {
          return;
        }
        const description = ticketItem.querySelector('.ticket-description');
        if (description.style.display === 'none') {
          description.style.display = 'block';
        } else {
          description.style.display = 'none';
        }
      });

      this.ticketList.appendChild(ticketItem);
    });
    this.container.appendChild(this.ticketList);
    const deleteButtons = this.container.querySelectorAll('.delete');
    deleteButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const ticketId = button.dataset.id;
        this.showDeleteModal(ticketId);
      });
    });

    const editButtons = this.container.querySelectorAll('.edit');
    editButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const ticketId = button.dataset.id;
        this.ticketService.getById(ticketId).then((ticket) => {
          this.renderEditTicketForm(ticket);
        });
      });
    });

    const circles = this.container.querySelectorAll('.circle');
    console.log(circles);
    circles.forEach((circle) => {
      circle.addEventListener('click', () => {
        circle.classList.toggle('color');
      });
    });
  }

  renderEditTicketForm(ticket) {
    if (!this.modal) {
      this.modal = document.createElement('div');
      this.modal.classList.add('modal');
      this.modal.innerHTML = `
        <div class="modal-content">
          <h2>Редактировать тикет</h2>
          <form id="edit-ticket-form" class="ticket-form">
            <label for="edit-ticket-name">Краткое описание:</label>
            <input type="text" id="edit-ticket-name" name="name" value="${ticket.name}" required>
            <label for="edit-ticket-description">Подробное описание:</label>
            <textarea id="edit-ticket-description" name="description">${ticket.description}</textarea>
             <div class="buttons-container">
                <button type="button" class="cancel">Отмена</button>
                <button type="submit" class="ok">ОК</button>
                </div>
          </form>
        </div>
      `;
      this.container.appendChild(this.modal);
      const cancelButton = this.modal.querySelector('.cancel');
      cancelButton.addEventListener('click', () => {
        this.container.removeChild(this.modal);
        this.modal = null;
      });
      const editTicketForm = this.modal.querySelector('#edit-ticket-form');
      editTicketForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(editTicketForm);
        const updatedTicket = {
          name: formData.get('name'),
          description: formData.get('description'),
          id: ticket.id,
        };
        this.ticketService.updateById(updatedTicket.id, updatedTicket).then(() => {
          this.container.removeChild(this.modal);
          this.modal = null;
          this.ticketService.list().then((tickets) => {
            this.renderTickets(tickets);
          });
        });
      });
    }
  }

  showDeleteModal(ticketId) {
    if (!this.modal) {
      this.modal = document.createElement('div');
      this.modal.classList.add('modal');
      this.modal.innerHTML = `
        <div class="modal-content">
          <h2>Удалить тикет</h2>
          <form id="delete-ticket-form" class="ticket-form">
           <div>Вы уверены, что хотите удалить тикет? Это действие необратимо</div>
             <div class="buttons-container">
                <button type="button" class="cancel">Отмена</button>
                <button type="submit" class="ok">ОК</button>
                </div>
          </form>
        </div>
      `;
      this.container.appendChild(this.modal);
      const cancelButton = this.modal.querySelector('.cancel');
      cancelButton.addEventListener('click', () => {
        this.container.removeChild(this.modal);
        this.modal = null;
      });
      const deleteTicketForm = this.modal.querySelector('#delete-ticket-form');
      deleteTicketForm.addEventListener('submit', (event) => {
        event.preventDefault();
        this.ticketService.deleteById(ticketId).then(() => {
          this.container.removeChild(this.modal);
          this.modal = null;
          this.ticketService.list().then((tickets) => {
            this.renderTickets(tickets);
          });
        });
      });
    }
  }
}
