import cx from 'classnames';
import TsxComponent, { createProps } from 'components/tsx-component';
import { Component, Watch } from 'vue-property-decorator';
import ResizeBar from 'components/shared/ResizeBar.vue';
import styles from './Layouts.m.less';
import { LayoutProps } from './Default';

@Component({ props: createProps(LayoutProps) })
export default class Classic extends TsxComponent<LayoutProps> {
  mounted() {
    window.addEventListener('resize', () => this.props.windowResizeHandler(this.mins));
    this.props.windowResizeHandler(this.mins);
    this.$emit('totalWidth', ['1', ['2', '3', '4']]);
  }
  destroyed() {
    window.removeEventListener('resize', () => this.props.windowResizeHandler(this.mins));
  }

  get totalWidth() {
    return this.props.elWidth;
  }

  @Watch('totalWidth')
  updateSize() {
    this.props.windowResizeHandler(this.mins);
  }

  get mins() {
    return {
      bar1: this.props.calculateMin(['2', '3', '4']),
      rest: this.props.calculateMin(['1']),
    };
  }

  get bar1() {
    return this.props.resizes.bar1;
  }
  set bar1(size: number) {
    console.log(size);
    this.props.setBarResize('bar1', size);
  }

  render() {
    return (
      <div class={styles.rows}>
        <div class={styles.cell} style={{ height: `calc(100% - ${this.bar1}px)` }}>
          {this.$slots['1']}
        </div>
        <ResizeBar
          position="top"
          vModel={this.bar1}
          onResizestart={() => this.props.resizeStartHandler()}
          onResizestop={() => this.props.resizeStopHandler()}
          max={this.props.calculateMax(this.mins.rest)}
          min={this.mins.bar1}
          reverse={true}
        />
        <div class={styles.segmented} style={{ height: `${this.bar1}px`, padding: '0 8px' }}>
          {['2', '3', '4'].map(slot => (
            <div class={cx(styles.cell, styles.noTopPadding)}>{this.$slots[slot]}</div>
          ))}
        </div>
      </div>
    );
  }
}
