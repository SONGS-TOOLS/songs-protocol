import {
  Bytes,
  dataSource,
  json,
  JSONValueKind,
} from '@graphprotocol/graph-ts';
import { TokenMetadata } from '../generated/schema';

export function handleTokenMetadata(content: Bytes): void {
  let tokenMetadata = new TokenMetadata(dataSource.stringParam());
  const value = json.fromBytes(content).toObject();
  if (value) {
    const image = value.get('image');
    const name = value.get('name');
    const description = value.get('description');
    const externalURL = value.get('external_url');
    const attributes = value.get('attributes');
    if (name) {
      tokenMetadata.name = name.toString();
    }
    if (image) {
      tokenMetadata.image = image.toString();
    }
    if (description) {
      tokenMetadata.description = description.toString();
    }
    if (externalURL) {
      tokenMetadata.externalURL = externalURL.toString();
    }
    if (attributes) {
      if (attributes.kind == JSONValueKind.ARRAY) {
        const attributesArray = attributes.toArray();
        const newArray = new Array<string>(attributesArray.length);
        for (let i = 0; i < attributesArray.length; i++) {
          const attribute = attributesArray[i].toObject();
          if (attribute) {
            const traitType = attribute.get('trait_type');
            const value = attribute.get('value');
            newArray[i] = '';

            if (traitType && value) {
              let valueString = '';
              if (value.kind == JSONValueKind.BOOL) {
                valueString = value.toBool().toString();
              } else if (value.kind == JSONValueKind.STRING) {
                valueString = '"' + value.toString() + '"';
              }

              const traitTypeString = traitType
                ? '"' + traitType.toString() + '"'
                : '';

              const entry =
                '{"traitType": ' +
                traitTypeString +
                ', "value": ' +
                valueString +
                '}';
              newArray[i] = entry;
            }
          }
        }

        tokenMetadata.attributes = '[' + newArray.join(',') + ']';
      }
    }

    tokenMetadata.save();
  }
}
