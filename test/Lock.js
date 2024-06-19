const { expect } = require("chai");

describe("Lock contract", function () {
  it("Retrieve numbers should return the correct values", async function () {
    const Lock = await ethers.getContractFactory("Lock");
    const lock = await Lock.deploy(); // Deploy the contract
    const numbers1 = await lock.numbers1(); // Call the numbers function directly
    const numbers2  = await lock.numbers2();
    // Check the returned values
    expect(numbers1[0]).to.equal(0);
    expect(numbers1[1]).to.equal(1);
    expect(numbers1[2]).to.equal(2); // Ensure the third element is as expected
    expect(numbers2[0]).to.equal(3);
    expect(numbers2[1]).to.equal(4);
    expect(numbers2[2]).to.equal(5);
  });
});

