import { ApproxStructure, Log, Pipeline, RealKeys } from '@ephox/agar';
import { UnitTest } from '@ephox/bedrock';
import { TinyApis, TinyLoader, TinyUi } from '@ephox/mcagar';
import NonbreakingPlugin from 'tinymce/plugins/nonbreaking/Plugin';
import theme from 'tinymce/themes/silver/Theme';

UnitTest.asynctest('browser.tinymce.plugins.nonbreaking.NonbreakingVisualCharsTypingTest', (success, failure) => {
  // Note: Uses RealKeys, so needs a browser. Headless won't work.

  theme();
  NonbreakingPlugin();

  TinyLoader.setup((editor, onSuccess, onFailure) => {
    const tinyUi = TinyUi(editor);
    const tinyApis = TinyApis(editor);

    Pipeline.async({}, [
      Log.stepsAsStep('TBA', '1. NonBreaking: Click on the nbsp button then type some text, and assert content is correct', [
        tinyUi.sClickOnToolbar('click on nbsp button', 'button[aria-label="Nonbreaking space"]'),
        RealKeys.sSendKeysOn(
          'iframe => body => p',
          [
            RealKeys.text('test')
          ]
        ),
        tinyApis.sAssertContentStructure(ApproxStructure.build((s, str, arr) => {
          return s.element('body', {
            children: [
              s.element('p', {
                children: [
                  s.element('span', {
                    classes: [ arr.has('mce-nbsp') ],
                    attrs: {
                      'data-mce-bogus': str.is('1')
                    },
                    children: [
                      s.text(str.is('\u00a0test'))
                    ]
                  })
                ]
              })
            ]
          });
        }))
      ]),

      tinyApis.sSetContent(''), // reset content

      Log.stepsAsStep('TBA', '2. NonBreaking: Add text to editor, click on the nbsp button, and assert content is correct', [
        tinyApis.sSetContent('test'),
        tinyApis.sSetCursor([0, 0], 4),
        tinyUi.sClickOnToolbar('click on nbsp button', 'button[aria-label="Nonbreaking space"]'),
        tinyApis.sAssertContentStructure(ApproxStructure.build((s, str, arr) => {
          return s.element('body', {
            children: [
              s.element('p', {
                children: [
                  s.text(str.is('test')),
                  s.element('span', {
                    classes: [ arr.has('mce-nbsp') ],
                    attrs: {
                      'data-mce-bogus': str.is('1')
                    },
                    children: [
                      s.text(str.is('\u00a0'))
                    ]
                  })
                ]
              })
            ]
          });
        }))
      ]),

      tinyApis.sSetContent(''), // reset content

      Log.stepsAsStep('TBA', '3. NonBreaking: Add content to editor, click on the nbsp button then type some text, and assert content is correct', [
        tinyApis.sSetContent('test'),
        tinyApis.sSetCursor([0, 0], 4),
        tinyUi.sClickOnToolbar('click on nbsp button', 'button[aria-label="Nonbreaking space"]'),
        RealKeys.sSendKeysOn(
          'iframe => body => p',
          [
            RealKeys.text('test')
          ]
        ),
        tinyApis.sAssertContentStructure(ApproxStructure.build((s, str, arr) => {
          return s.element('body', {
            children: [
              s.element('p', {
                children: [
                  s.text(str.is('test')),
                  s.element('span', {
                    classes: [ arr.has('mce-nbsp') ],
                    attrs: {
                      'data-mce-bogus': str.is('1')
                    },
                    children: [
                      s.text(str.is(' test'))
                    ]
                  })
                ]
              })
            ]
          });
        }))
      ]),

      tinyApis.sSetContent(''), // reset content

      Log.stepsAsStep('TBA', '4. NonBreaking: Click on the nbsp button then type a space, and assert content is correct', [
        tinyUi.sClickOnToolbar('click on nbsp button', 'button[aria-label="Nonbreaking space"]'),
        RealKeys.sSendKeysOn(
          'iframe => body => p',
          [
            RealKeys.text(' ')
          ]
        ),
        tinyApis.sAssertContentStructure(ApproxStructure.build((s, str, arr) => {
          return s.element('body', {
            children: [
              s.element('p', {
                children: [
                  s.element('span', {
                    classes: [ arr.has('mce-nbsp') ],
                    attrs: {
                      'data-mce-bogus': str.is('1')
                    },
                    children: [
                      s.text(str.is('\u00a0\u00a0'))
                    ]
                  })
                ]
              })
            ]
          });
        }))
      ]),

      tinyApis.sSetContent(''), // reset content

      Log.stepsAsStep('TBA', '5. NonBreaking: Add text to editor, click on the nbsp button and add content plus a space, and assert content is correct', [
        tinyApis.sSetContent('test'),
        tinyApis.sSetCursor([0, 0], 4),
        tinyUi.sClickOnToolbar('click on nbsp button', 'button[aria-label="Nonbreaking space"]'),
        tinyApis.sAssertContentStructure(ApproxStructure.build((s, str, arr) => {
          return s.element('body', {
            children: [
              s.element('p', {
                children: [
                  s.text(str.is('test')),
                  s.element('span', {
                    classes: [ arr.has('mce-nbsp') ],
                    attrs: {
                      'data-mce-bogus': str.is('1')
                    },
                    children: [
                      s.text(str.is('\u00a0'))
                    ]
                  })
                ]
              })
            ]
          });
        })),
        RealKeys.sSendKeysOn(
          'iframe => body => p',
          [
            RealKeys.text('test ')
          ]
        ),
        tinyApis.sAssertContentStructure(ApproxStructure.build((s, str, arr) => {
          return s.element('body', {
            children: [
              s.element('p', {
                children: [
                  s.text(str.is('test')),
                  s.element('span', {
                    classes: [ arr.has('mce-nbsp') ],
                    attrs: {
                      'data-mce-bogus': str.is('1')
                    },
                    children: [
                      s.text(str.is(' test\u00a0'))
                    ]
                  })
                ]
              })
            ]
          });
        }))
      ]),

    ], onSuccess, onFailure);
  }, {
    plugins: 'nonbreaking visualchars',
    toolbar: 'nonbreaking visualchars',
    visualchars_default_state: true,
    base_url: '/project/tinymce/js/tinymce'
  }, success, failure);
});