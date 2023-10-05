import { animated, config, useSprings } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import swap from 'lodash-move';
import clamp from 'lodash.clamp';
import { memo, useRef } from 'react';
import styles from './styles.module.css';
let result = [];
let returnData;
const fn =
    (order: number[], active = false, originalIndex = 0, curIndex = 0, y = 0) =>
    (index: number) =>
        active && index === originalIndex
            ? {
                  y: curIndex * 160 + y,
                  scale: 1.1,
                  zIndex: 1,
                  shadow: 15,
                  immediate: (key: string) => key === 'zIndex',
                  config: (key: string) => (key === 'y' ? config.stiff : config.default),
              }
            : {
                  y: order.indexOf(index) * 160,
                  scale: 1,
                  zIndex: 0,
                  shadow: 1,
                  immediate: false,
              };

function DraggableList({ items }: { items: string[] }) {
    const order = useRef(items.map((_, index) => index)); // Store indicies as a local ref, this represents the item order
    const [springs, api] = useSprings(items.length, fn(order.current)); // Create springs, each corresponds to an item, controlling its transform, scale, etc.
    const bind = useDrag(({ args: [originalIndex], active, movement: [, y] }) => {
        const curIndex = order.current.indexOf(originalIndex);
        const curRow = clamp(Math.round((curIndex * 160 + y) / 160), 0, items.length - 1);
        const newOrder = swap(order.current, curIndex, curRow);
        api.start(fn(newOrder, active, originalIndex, curIndex, y)); // Feed springs new style data, they'll animate the view without causing a single render
        if (!active) order.current = newOrder;
        returnData(newOrder);
    });
    return (
        <div className={styles.content} style={{ height: items.length * 160 }}>
            {springs.map(({ zIndex, shadow, y, scale }, i) => (
                <animated.div
                    {...bind(i)}
                    key={i}
                    style={{
                        zIndex,
                        boxShadow: shadow.to((s) => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`),
                        y,
                        scale,
                    }}
                    children={items[i]}
                />
            ))}
        </div>
    );
}

function SortElement({ items, getData }) {
    returnData = getData;
    const arr = [];
    items.forEach((element) => {
        arr.push(
            <div
                className="img"
                style={{
                    backgroundImage: `url(${element.src})`,
                    width: '200px',
                    height: ' 150px',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'contain',
                }}
            ></div>
        );
    });
    return (
        <div className="content-sort">
            <div className="test ">
                <DraggableList items={arr} />
            </div>
        </div>
    );
}
export default memo(SortElement);
