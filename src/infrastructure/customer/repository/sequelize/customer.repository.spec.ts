import { Sequelize } from "sequelize-typescript";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import CustomerModel from "./customer.model";
import CustomerRepository from "./customer.repository";
import SendLogWhenCustomerIsCreatedHandler01 from "../../../../domain/customer/event/handler/Send-log-when-customer-is-created.handler-1"
import SendLogWhenCustomerIsCreatedHandler02 from "../../../../domain/customer/event/handler/Send-log-when-customer-is-created.handler-2"
import SendLogWhenCustomerAddressIsChanged from "../../../../domain/customer/event/handler/Send-log-when-customer-address-is-changed.handler"
import EventDispatcher from "../../../../domain/@shared/event/event-dispatcher"
import CustomerCreatedEvent from "../../../../domain/customer/event/customer-created.event"
import CustomerAddressChangedEvent from "../../../../domain/customer/event/customer-address-changed.event"



describe("Customer repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([CustomerModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a customer", async () => {

    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.Address = address;
    await customerRepository.create(customer);

    const customerModel = await CustomerModel.findOne({ where: { id: "123" } });

    expect(customerModel.toJSON()).toStrictEqual({
      id: "123",
      name: customer.name,
      active: customer.isActive(),
      rewardPoints: customer.rewardPoints,
      street: address.street,
      number: address.number,
      zipcode: address.zip,
      city: address.city,
    });
  });

  it("should update a customer", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.Address = address;
    await customerRepository.create(customer);

    customer.changeName("Customer 2");
    await customerRepository.update(customer);
    const customerModel = await CustomerModel.findOne({ where: { id: "123" } });

    expect(customerModel.toJSON()).toStrictEqual({
      id: "123",
      name: customer.name,
      active: customer.isActive(),
      rewardPoints: customer.rewardPoints,
      street: address.street,
      number: address.number,
      zipcode: address.zip,
      city: address.city,
    });
  });

  it("should find a customer", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.Address = address;
    await customerRepository.create(customer);

    const customerResult = await customerRepository.find(customer.id);

    expect(customer).toStrictEqual(customerResult);
  });

  it("should throw an error when customer is not found", async () => {
    const customerRepository = new CustomerRepository();

    expect(async () => {
      await customerRepository.find("456ABC");
    }).rejects.toThrow("Customer not found");
  });

  it("should find all customers", async () => {
    const customerRepository = new CustomerRepository();
    const customer1 = new Customer("123", "Customer 1");
    const address1 = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer1.Address = address1;
    customer1.addRewardPoints(10);
    customer1.activate();

    const customer2 = new Customer("456", "Customer 2");
    const address2 = new Address("Street 2", 2, "Zipcode 2", "City 2");
    customer2.Address = address2;
    customer2.addRewardPoints(20);

    await customerRepository.create(customer1);
    await customerRepository.create(customer2);

    const customers = await customerRepository.findAll();

    expect(customers).toHaveLength(2);
    expect(customers).toContainEqual(customer1);
    expect(customers).toContainEqual(customer2);
  });


  it("should create a customer and call event handlers", async () => {
    const eventDispatcher = new EventDispatcher();

    const eventHandler1 = new SendLogWhenCustomerIsCreatedHandler01();
    const eventHandler2 = new SendLogWhenCustomerIsCreatedHandler02();

    const spyHandler1 = jest.spyOn(eventHandler1, "handle");
    const spyHandler2 = jest.spyOn(eventHandler2, "handle");

    eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

    const customerRepository = new CustomerRepository(eventDispatcher);
    const customer = new Customer("1", "Customer");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.Address = address;

    await customerRepository.create(customer);

    expect(spyHandler1).toHaveBeenCalled();
    expect(spyHandler2).toHaveBeenCalled();

    expect(spyHandler1).toHaveBeenCalledWith(expect.any(CustomerCreatedEvent));

    const customerModel = await CustomerModel.findOne({ where: { id: "1" } });
    expect(customerModel.toJSON()).toMatchObject({
      id: "1",
      name: "Customer"
    });
  });

  it("should notify when customer address is changed", async () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendLogWhenCustomerAddressIsChanged();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    // REGISTRO OBRIGATÓRIO
    eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);

    const customerRepository = new CustomerRepository(eventDispatcher);

    const customer = new Customer("123", "Cliente 1");
    const address = new Address("Rua A", 1, "12345", "Cidade");
    customer.changeAddress(address);

    // Cria o cliente primeiro para poder atualizar depois
    await customerRepository.create(customer);

    const newAddress = new Address("Rua B", 2, "54321", "Nova Cidade Full Cycle");
    customer.changeAddress(newAddress);

    // Executa o update que deve disparar o evento
    await customerRepository.update(customer);
    expect(spyEventHandler).toHaveBeenCalled();
    expect(spyEventHandler).toHaveBeenCalledWith(expect.any(CustomerAddressChangedEvent));
  });

});
