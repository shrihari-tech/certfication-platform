// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Certification {
    // Structure to hold certificate details
    struct Certificate {
        uint256 id;
        string name;
        string course;
        string dateOfIssue;
        address issuedBy;
        bool isValid;
        string did;  // Decentralized Identifier
    }

    // Arrays to store certificates and invalid certificates
    Certificate[] public certificates;
    Certificate[] public invalidCertificates;

    // Address of the institution
    address public institution;

    // Modifier to restrict access to only the institution
    modifier onlyInstitution() {
        require(msg.sender == institution, "Only institution can issue certificates");
        _;
    }

    // Event to log certificate issuance
    event CertificateIssued(uint256 id, string name, string course, string dateOfIssue, address issuedBy, string did);
    // Event to log certificate invalidation
    event CertificateInvalidated(uint256 id);

    // Function to issue a certificate
    function issueCertificate(
        string memory _name,
        string memory _course,
        string memory _dateOfIssue,
        string memory _did
    ) public onlyInstitution {
        uint256 certId = certificates.length + 1;
        Certificate memory newCert = Certificate(
            certId,
            _name,
            _course,
            _dateOfIssue,
            msg.sender,
            true,
            _did
        );
        certificates.push(newCert);
        emit CertificateIssued(certId, _name, _course, _dateOfIssue, msg.sender, _did);
    }

    // Function to verify a certificate
    function verifyCertificate(uint256 _id) public view returns (
        string memory name,
        string memory course,
        string memory dateOfIssue,
        address issuedBy,
        bool isValid,
        string memory did
    ) {
        require(_id > 0 && _id <= certificates.length, "Certificate does not exist");
        Certificate memory cert = certificates[_id - 1];
        return (cert.name, cert.course, cert.dateOfIssue, cert.issuedBy, cert.isValid, cert.did);
    }

    // Function to invalidate a certificate
    function invalidateCertificate(uint256 _id) public onlyInstitution {
        require(_id > 0 && _id <= certificates.length, "Certificate does not exist");
        Certificate storage cert = certificates[_id - 1];
        cert.isValid = false;
        invalidCertificates.push(cert);
        emit CertificateInvalidated(_id);
    }

    // Function to return all valid certificates
    function getValidCertificates() public view returns (Certificate[] memory) {
        return certificates;
    }

    // Function to return all invalid certificates
    function getInvalidCertificates() public view returns (Certificate[] memory) {
        return invalidCertificates;
    }

    // Getter function to return the institution address
    function getInstitution() public view returns (address) {
        return institution;
    }

    // Function to set the institution address (only callable once)
    function setInstitution(address _institution) public {
        require(institution == address(0), "Institution address already set");
        institution = _institution;
    }
}
