import {CytoscapeNodeLayout} from './cytoscape-node-layout';
import {AnchorPathNode} from './anchor-path-node';

export class CytoscapeNode {
  public data: CytoscapeNodeData;

  constructor(anchorPathNode: AnchorPathNode, layouter?: Map<string, CytoscapeNodeLayout>) {
    if (anchorPathNode) {
      this.data = new CytoscapeNodeData(anchorPathNode, layouter);
    }
    return this;
  }
}

/**
 * Format:
 *     { data: { id: 'a', name: 'Signup', weight: 100, colorCode: 'blue', shapeType: 'roundrectangle' } }
 */
export class CytoscapeNodeData {
  public id: string;
  public name: string;
  public weight: number;
  public colorCode: string;
  public shapeType: string;
  public type: string;
  public timestamp: string;
  public positionInChain: number;

  constructor(anchorPathNode: AnchorPathNode, layouter?: Map<string, CytoscapeNodeLayout>) {
    if (anchorPathNode) {
      this.name = anchorPathNode.label; // + ' (' + anchorPathNode.timestamp + ')';
      this.id = anchorPathNode.hash;
      this.type = anchorPathNode.type;
      this.timestamp = anchorPathNode.timestamp;
      this.weight = 100;
      this.positionInChain = anchorPathNode.indexInChain;

      const layout = this.getNodeLayout(anchorPathNode.type, layouter);
      this.colorCode = layout.colorCode;
      this.shapeType = layout.shapeType;
    }
    return this;
  }

  private getNodeLayout(type: string, layouter: Map<string, CytoscapeNodeLayout>): CytoscapeNodeLayout {
    let layout = new CytoscapeNodeLayout();
    if (layouter && layouter.get(type)) {
      layout = layouter.get(type);
    }
    return layout;
  }
}
