import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerAddressChangedEvent from "../customer-address-changed.event";

export default class SendLogWhenCustomerAddressIsChangedHandler
    implements EventHandlerInterface<CustomerAddressChangedEvent> {

    handle(event: CustomerAddressChangedEvent): void {
        const { id, nome, endereco } = event.eventData;
        console.log(`Endereço do cliente: ${id}, ${nome} alterado para: ${endereco}`);
    }
}
