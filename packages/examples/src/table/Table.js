import React, { useMemo } from 'react';
import * as ReactIs from "react-is";
import { View, Text } from '@react-pdf/renderer';

/**Flatten nested arrays to single array*/
function flattenDeep(arr) {
  return arr
    .map(el => Array.isArray(el) ? flattenDeep(el) : el)
    .flat();
}
/**Convert JSX.Element, JSX.Element[], JSX.Element[][], undefined, null, false, etc...
 * into a JSX.Element[]*/
function jsxNormalize(jsxChildren) {
  const children = (Array.isArray(jsxChildren) ? flattenDeep(jsxChildren) : [jsxChildren]) || [];
  return children
    .filter(c => !!c) // remove undefined, null, false, things that are falsy
    // Convert everything to elements if not already
    .map(c => ReactIs.isElement(c) ? c : <Text>c</Text>)
}
/**Gets all nested real children inside of JSX.Elements and fragments*/
function getChildrenInFragments(jsxChildren) {
  return jsxNormalize(jsxChildren)
    .map((c) => {
      if (!ReactIs.isFragment(c)) {
        return c; // return as-is if not something to unwrap from
      }
      if (!c.props.children) {
        return [];
      }
      return getChildrenInFragments(c.props.children);
    })
    .flat();
}
/**Get a JSX.Elemengt mixed in with the passed props*/
function jsxElementMergeProps(el, props) {
  // elements/props are readonly, they have to be cloned/props has to be cloned
  return Object.assign({}, el, {
    props: Object.assign({}, el.props, props)
  });
}

/**A table-like element using pdf elements. It will take a list of TRows each of
 * which contain N elements. These elements will be flex'd next to each other
 * and can have their styles BY COLUMN in an array on this element
 *
 * Example:
 * If you want a 2 column table with 25% for the first row, and right aligned 75%
 * for the second row...
 * ```
 * <Table colStyles={[{width: '25%'}, {width: '75%', align: 'right'}]}>
 *   <TRow />
 *   <TRow />
 * </Table>
 * ```
 */
export function Table({ children, colStyles, style, wrap }) {
  const childrenWithCols = useMemo(()=>
    // Find every direct TRow or THead and add properties to their direct children
    getChildrenInFragments(children)
      .map(c => jsxElementMergeProps(c, { colStyles: colStyles || [] }))
  , [children, colStyles]);

  return <View style={{ flexDirection: 'column', ...style }} wrap={wrap ?? true}>
    {childrenWithCols}
  </View>
}

/**Gets the TRow children with styles applied*/
function getChildrenForTRowStyled(jsxChildren, styles) {
  return getChildrenInFragments(jsxChildren)
    .map((c, idx) => {
      const style = styles[idx] ?? {};
      const newStyle = Object.assign({}, style, c?.props?.style);
      return jsxElementMergeProps(c, { style: newStyle });
    });
}

export function TRow({ children, colStyles, style, ...props }) {
  const childrenWithCol = useMemo(()=>{
    // Find every direct TRow or THead and add properties to their direct children
    return getChildrenForTRowStyled(children || [], colStyles ?? []);
  }, [children, colStyles]);

  return <View style={{ flexDirection: 'row', ...style }} {...props}>
    {childrenWithCol}
  </View>
}

//TRow with a border bottom
export function THead(props) {
  return <TRow style={{ borderBottom: '1px solid #D9D9D9' }} {...props} />;
};
