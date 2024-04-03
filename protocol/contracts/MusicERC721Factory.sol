// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./MusicERC721.sol";

contract MusicERC721Factory {
    // Evento para emitir cuando se despliegue un nuevo contrato MusicERC721
    event MusicERC721Deployed(address indexed owner, address indexed contractAddress, string tokenURI);

    // Mapeo de propietario a lista de direcciones de contratos desplegados
    mapping(address => address[]) public ownerToContracts;

    function deployMusicERC721(
        string memory name,
        string memory symbol,
        string memory metadataURI
    ) public returns (address) {
        MusicERC721 musicNFT = new MusicERC721(name, symbol);
        musicNFT.setTokenUri(metadataURI); // Asumiendo que `setTokenUri` es una función válida en MusicERC721
        musicNFT.mint(msg.sender);

        // Guardar la dirección del contrato desplegado asociado con el propietario
        ownerToContracts[msg.sender].push(address(musicNFT));

        emit MusicERC721Deployed(msg.sender, address(musicNFT), metadataURI);
        return address(musicNFT);
    }

    // Función para obtener la lista de contratos desplegados por un propietario
    function getDeployedContractsByOwner(address owner) public view returns (address[] memory) {
        return ownerToContracts[owner];
    }
}
