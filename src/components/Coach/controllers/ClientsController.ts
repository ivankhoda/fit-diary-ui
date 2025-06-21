import { action } from 'mobx';

import ClientsStore, { ClientInterface } from '../store/clientsStore';
import { BaseController } from '../../../controllers/BaseController';
import getApiBaseUrl from '../../../utils/apiUrl';
import Delete from '../../../utils/DeleteRequest';
import Get from '../../../utils/GetRequest';
import Post from '../../../utils/PostRequest';

export default class ClientsController extends BaseController {
  clientsStore: ClientsStore;

  constructor(clientsStore: ClientsStore) {
      super();
      this.clientsStore = clientsStore;
  }

  @action
  fetchClients(): void {
      new Get({
          url: `${getApiBaseUrl()}/coach/clients`
      }).execute()
          .then(r => r.json())
          .then(res => {
              if (res.ok) {
                  this.clientsStore.setClients(res.clients);
              }
          })
          .catch((error: unknown): void => {
              console.error('Failed to fetch clients:', error);
          });
  }

  @action
  fetchClientById(clientId: number): Promise<ClientInterface | null> {
      return new Get({
          url: `${getApiBaseUrl()}/coach/clients/${clientId}`
      }).execute()
          .then(r => r.json())
          .then(res => {
              if (res.ok && res.client) {
                  return res.client as ClientInterface;
              }
              console.warn('Client not found');
              return null;
          })
          .catch(error => {
              console.error(`Failed to fetch client with id ${clientId}:`, error);
              return null;
          });
  }

  @action
  addClient(email: string): void {
      new Post({
          params: { email },
          url: `${getApiBaseUrl()}/coach/clients`
      }).execute()
          .then(r => r.json())
          .then(res => {
              if (res.ok) {
                  this.clientsStore.addClient(res.client);
              } else {
                  // eslint-disable-next-line no-alert
                  alert(res.error || 'Не удалось добавить клиента');
              }
          })
          .catch((error: unknown): void => {
              console.error('Failed to add client:', error);
          });
  }

  @action
  removeClient(clientId: number): void {
      new Delete({
          url: `${getApiBaseUrl()}/coach/clients/${clientId}`
      }).execute()
          .then(r => r.json())
          .then(res => {
              if (res.ok) {
                  this.clientsStore.removeClient(clientId);
              } else {
                  // eslint-disable-next-line no-alert
                  alert(res.error || 'Не удалось удалить клиента');
              }
          })
          .catch(error => {
              console.error('Failed to remove client:', error);
          });
  }
}
