"use client"

import React, { useEffect } from 'react';

type IConnectButtonProps = {}

const IConnectButtonDefaultProps = {}

const ConnectButton: React.FC<IConnectButtonProps> = (props) => {
  const {} = props;

  useEffect(() => {

  }, []);

  return (
    <w3m-button />
  )
}

ConnectButton.defaultProps = IConnectButtonDefaultProps;

export default ConnectButton;