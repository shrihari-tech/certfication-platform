const { expect } = require("chai");

describe("Certification", function () {
  let Certification, certification, institution, student;

  beforeEach(async function () {
    Certification = await ethers.getContractFactory("Certification");
    [institution, student] = await ethers.getSigners();
    certification = await Certification.deploy();
    //await certification.deployTransaction.wait();  // Wait for deployment to be mined
  });

  it("should set the institution", async function () {
    await certification.setInstitution(institution.address);
    expect(await certification.getInstitution()).to.equal(institution.address);
  });

  it("should issue a certificate", async function () {
    await certification.setInstitution(institution.address); // Set institution first
    await expect(
      certification.issueCertificate("John Doe", "Blockchain 101", "2024-06-19", "did:example:123")
    ).to.emit(certification, "CertificateIssued").withArgs(1, "John Doe", "Blockchain 101", "2024-06-19", institution.address, "did:example:123");

    const cert = await certification.certificates(0);

    expect(cert.name).to.equal("John Doe");
    expect(cert.course).to.equal("Blockchain 101");
    expect(cert.dateOfIssue).to.equal("2024-06-19");
    expect(cert.issuedBy).to.equal(institution.address);
    expect(cert.isValid).to.be.true;
    expect(cert.did).to.equal("did:example:123");
  });

  it("should verify a certificate", async function () {
    await certification.setInstitution(institution.address); // Set institution first
    await certification.issueCertificate("Jane Doe", "Ethereum 101", "2024-06-19", "did:example:456");

    const cert = await certification.verifyCertificate(1);

    expect(cert.name).to.equal("Jane Doe");
    expect(cert.course).to.equal("Ethereum 101");
    expect(cert.dateOfIssue).to.equal("2024-06-19");
    expect(cert.issuedBy).to.equal(institution.address);
    expect(cert.isValid).to.be.true;
    expect(cert.did).to.equal("did:example:456");
  });

  it("should invalidate a certificate", async function () {
    await certification.setInstitution(institution.address); // Set institution first
    await certification.issueCertificate("John Smith", "Solidity 101", "2024-06-19", "did:example:789");
    await certification.invalidateCertificate(1);

    const cert = await certification.certificates(0);

    expect(cert.isValid).to.be.false;

    const invalidCert = await certification.invalidCertificates(0);

    expect(invalidCert.name).to.equal("John Smith");
    expect(invalidCert.course).to.equal("Solidity 101");
    expect(invalidCert.dateOfIssue).to.equal("2024-06-19");
    expect(invalidCert.issuedBy).to.equal(institution.address);
    expect(invalidCert.isValid).to.be.false;
    expect(invalidCert.did).to.equal("did:example:789");
  });

  it("should not allow non-institution to issue a certificate", async function () {
    await expect(
      certification.connect(student).issueCertificate("Alice", "Web3 101", "2024-06-19", "did:example:321")
    ).to.be.revertedWith("Only institution can issue certificates");
  });

  it("should not allow non-institution to invalidate a certificate", async function () {
    await certification.setInstitution(institution.address); // Set institution first
    await certification.issueCertificate("Bob", "Crypto 101", "2024-06-19", "did:example:654");
    await expect(
      certification.connect(student).invalidateCertificate(1)
    ).to.be.revertedWith("Only institution can issue certificates");
  });

  it("should return all valid certificates", async function () {
    await certification.setInstitution(institution.address); // Set institution first
    await certification.issueCertificate("John Doe", "Blockchain 101", "2024-06-19", "did:example:123");
    await certification.issueCertificate("Jane Doe", "Ethereum 101", "2024-06-19", "did:example:456");

    const validCertificates = await certification.getValidCertificates();
    expect(validCertificates.length).to.equal(2);
    expect(validCertificates[0].name).to.equal("John Doe");
    expect(validCertificates[1].name).to.equal("Jane Doe");
  });

  it("should return all invalid certificates", async function () {
    await certification.setInstitution(institution.address); // Set institution first
    await certification.issueCertificate("John Doe", "Blockchain 101", "2024-06-19", "did:example:123");
    await certification.issueCertificate("Jane Doe", "Ethereum 101", "2024-06-19", "did:example:456");
    await certification.invalidateCertificate(1);

    const invalidCertificates = await certification.getInvalidCertificates();
    expect(invalidCertificates.length).to.equal(1);
    expect(invalidCertificates[0].name).to.equal("John Doe");
  });
});
