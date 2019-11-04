import {AnchorPathNode} from './anchor-path-node';
import {BlockChainNode} from './block-chain-node';
import {isArray} from 'util';

export class Upp {
  public upp: string;
  public anchors: {
    upperPath: AnchorPathNode[],
    upperBlockChains: BlockChainNode[],
    lowerPath: AnchorPathNode[],
    lowerBlockChains: BlockChainNode[]
  };
  constructor(jsonUpp: any) {
    if (jsonUpp) {
      this.upp = jsonUpp.upp;
      this.anchors = {
        upperPath: [],
        upperBlockChains: [],
        lowerPath: [],
        lowerBlockChains: []
      };
      if (jsonUpp.anchors) {
        const anchors = jsonUpp.anchors;
        this.readArrayOfAnchorNodes(anchors.upper_path, this.anchors.upperPath, 'AnchorPathNode');
        this.readArrayOfAnchorNodes(anchors.lower_path, this.anchors.lowerPath, 'AnchorPathNode');
        this.readArrayOfAnchorNodes(anchors.upper_blockchains, this.anchors.upperBlockChains, 'BlockChainNode');
        this.readArrayOfAnchorNodes(anchors.lower_blockchains, this.anchors.lowerBlockChains, 'BlockChainNode');
      }
    }
    return this;
  }
  private readArrayOfAnchorNodes(data: any, target: any[], type: string) {
    if (data && isArray(data)) {
      switch (type) {
        case('AnchorPathNode'):
          data.forEach(path => target.push(new AnchorPathNode(path)));
          break;
        case('BlockChainNode'):
          data.forEach(path => target.push(new BlockChainNode(path)));
          break;
      }
    }
  }
}
