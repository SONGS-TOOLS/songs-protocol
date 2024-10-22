import {
  Bytes,
  dataSource,
  json,
  JSONValueKind,
} from '@graphprotocol/graph-ts';
import { Attributes } from '../generated/schema';

export function handleAttributes(content: Bytes): void {
  let tokenMetadata = new Attributes(dataSource.stringParam());
  const value = json.fromBytes(content).toArray();
  if (value) {
    const attributes = value;

    
    if (attributes) {
      const newArray = new Array<string>(attributes.length);
      for (let i = 0; i < attributes.length; i++) {
        const attribute = attributes[i].toObject();
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
              '{"trait_type": ' +
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

    tokenMetadata.save();
  }
}
