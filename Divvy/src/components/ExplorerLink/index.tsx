import React from "react";
import { Typography } from "antd";
import { shortenAddress } from "../../utils/utils";
import { PublicKey } from "@solana/web3.js";

export const explorerUrl = (type: "transaction", address: string, cluster?: string) => {
  const clusterParam = cluster !== undefined ? `?cluster=${cluster}` : "";
  return `https://explorer.solana.com/${type}/${address}${clusterParam}`
}

export const ExplorerLink = (props: {
  address: string | PublicKey;
  cluster: string | undefined;
  type:  "transaction";
  code?: boolean;
  style?: React.CSSProperties;
  length?: number;
}) => {
  const { type, code, cluster } = props;

  const address =
    typeof props.address === "string"
      ? props.address
      : props.address?.toBase58();

  if (!address) {
    return null;
  }

  const length = props.length ?? 9;

  return (
    <a
      href={explorerUrl(type, address, cluster)}
      // eslint-disable-next-line react/jsx-no-target-blank
      target="_blank"
      rel="noreferrer"
      title={address}
      className="ExplorerLink"
      style={props.style}
    >
      {code ? (
        <Typography.Text style={props.style} code>
          {shortenAddress(address, length)}
        </Typography.Text>
      ) : (
        shortenAddress(address, length)
      )}
    </a>
  );
};