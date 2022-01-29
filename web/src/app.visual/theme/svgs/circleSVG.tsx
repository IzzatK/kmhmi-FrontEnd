import React from 'react';
import {SVGModel} from '../../../framework.visual/model/svgModel';

export const CircleSVG = ({className} : SVGModel) => (
    <svg className={className} viewBox="0 0 32 32">
        <circle cx={16} cy={16} r={14}/>
    </svg>
);
