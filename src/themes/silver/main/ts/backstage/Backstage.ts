import { AlloyComponent, AlloySpec, Layout } from '@ephox/alloy';
import { AnchorSpec } from '@ephox/alloy/lib/main/ts/ephox/alloy/positioning/mode/Anchoring';
import { FormParts } from '@ephox/alloy/lib/main/ts/ephox/alloy/ui/types/FormTypes';
import { Option, Result } from '@ephox/katamari';
import { Element, Selection } from '@ephox/sugar';
import I18n, { TranslatedString } from 'tinymce/core/api/util/I18n';
import * as UiFactory from 'tinymce/themes/silver/ui/general/UiFactory';

import { SelectData } from '../ui/core/complex/BespokeSelect';
import { IconProvider } from '../ui/icons/Icons';
import { ColorInputBackstage, UiFactoryBackstageForColorInput } from './ColorInputBackstage';
import { init as initStyleFormatBackstage } from './StyleFormatsBackstage';
import { UiFactoryBackstageForUrlInput, UrlInputBackstage } from './UrlInputBackstage';
import { Editor } from 'tinymce/core/api/Editor';

// INVESTIGATE: Make this a body component API ?
export type BridgedType = any;

export interface UiFactoryBackstageProviders {
  icons: IconProvider;
  translate: (any) => TranslatedString;
}

type UiFactoryBackstageForStyleButton = SelectData;

export interface UiFactoryBackstageShared {
  providers?: UiFactoryBackstageProviders;
  interpreter?: (spec: BridgedType) => AlloySpec;
  anchors?: {
    toolbar: () => AnchorSpec,
    banner: () => AnchorSpec,
    cursor: () => AnchorSpec,
    node: (elem: Option<Element>) => AnchorSpec
  };
  formInterpreter?: (parts: FormParts, spec: BridgedType, backstage: UiFactoryBackstage) => AlloySpec;
  getSink?: () => Result<AlloyComponent, any>;
}

export interface UiFactoryBackstage {
  urlinput?: UiFactoryBackstageForUrlInput;
  styleselect?: UiFactoryBackstageForStyleButton;
  shared?: UiFactoryBackstageShared;
  colorinput?: UiFactoryBackstageForColorInput;
}

const init = (sink: AlloyComponent, editor: Editor, lazyToolbar: () => AlloyComponent): UiFactoryBackstage => {
  const backstage: UiFactoryBackstage = {
    shared: {
      providers: {
        icons: () => editor.ui.registry.getAll().icons,
        translate: I18n.translate,
      },
      interpreter: (s) => {
        return UiFactory.interpretWithoutForm(s, backstage);
      },
      anchors: {
        toolbar: () => {
          return {
            anchor: 'hotspot',
            // TODO AP-174 (below)
            hotspot: lazyToolbar(),
            layouts: {
              onRtl: () => [ Layout.southeast ],
              onLtr: () => [ Layout.southwest ]
            }
          };
        },
        banner: () => {
          return {
            anchor: 'hotspot',
            // TODO AP-174 (below)
            hotspot: lazyToolbar(),
            layouts: {
              onRtl: () => [ Layout.south ],
              onLtr: () => [ Layout.south ]
            }
          };
        },
        cursor: () => {
          return {
            anchor: 'selection',
            root: Element.fromDom(editor.getBody()),
            getSelection: () => {
              const rng = editor.selection.getRng();
              return Option.some(
                Selection.range(Element.fromDom(rng.startContainer), rng.startOffset, Element.fromDom(rng.endContainer), rng.endOffset)
              );
            }
          };
        },
        node: (element: Option<Element>) => {
          return {
            anchor: 'node',
            root: Element.fromDom(editor.getBody()),
            node: element
          };
        }
      },
      getSink: () => Result.value(sink)
    },
    urlinput: UrlInputBackstage(editor),
    styleselect: initStyleFormatBackstage(editor),
    colorinput: ColorInputBackstage(editor)
  };

  return backstage;
};

export { init };