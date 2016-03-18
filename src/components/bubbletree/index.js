import { Api } from '../../api/index'
import c3 from 'c3'
import * as Utils from '../utils.js'
import _ from 'lodash'
import events from 'events'
import BubbleTree from 'bubbletree'
window.BubbleTree = BubbleTree;
var api = new Api();


export class BubbleTreeComponent extends events.EventEmitter {

  constructor() {
    super();
    this.wrapper = null;
    this.bubbleTreet = null;
  }

  refresh() {
    //var bounds = this.wrapper.getBoundingClientRect();
    //this.bubbleTree.resize({
    //  height: bounds.height,
    //  width: bounds.width
    //});
  }

  generateBubbuleTreeData (cells, params) {
    var children = [];
    _.each(cells, (cell) => {
      var dimension = _.first(cell.dimensions);
      var measure = _.find(cell.measures, {key: params.aggregates});
      children.push({
        label: dimension.nameValue,
        amount: measure.value
      });
    });
      return {
        label: 'Total',
        amount: _.reduce(
          children,
          function(result, item) {
            return result + item.amount;
          },
          0
        ),
        children: children
      };
    };

  build(endpoint, cube, params, wrapper, colorSchema) {
    var that = this;
    this.wrapper = wrapper;

    this.emit('beginAggregate', this);

    api.aggregate(endpoint, cube, params).then((data) => {
      var bubbleTreeData = this.generateBubbuleTreeData(
        data.cells,
        params
      );

      that.bubbleTree = new BubbleTree({
        autoColors: true,
        data: bubbleTreeData,
        container: wrapper
      });
      this.emit('endAggregate', that, data);
    });
  }
}

export default BubbleTreeComponent
