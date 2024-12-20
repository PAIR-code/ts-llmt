/** Copyright 2024 Google LLC. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

@license SPDX-License-Identifier: Apache-2.0
============================================================================= */

import { template, nv, Template } from '../template';
import { FewShotTemplate } from '../fewshot_template';

interface Experience {
  experience: string;
  aboutEntity: string;
  likedOrDisliked: string;
  characteristics: string[];
}

interface ExperienceTemplEntry {
  experience: string;
  aboutEntity: string;
  likedOrDisliked: string;
  characteristics: string;
}

export const characteristicsTempl = new FewShotTemplate(
  template`<like-or-dislike-phrase>${nv(
    'characteristic'
  )}</like-or-dislike-phrase>`,
  '\n  '
);

const criteriaPoints: Experience[] = [
  {
    experience: 'Parc des Buttes Chaumont: love it.',
    aboutEntity: 'Parc des Buttes Chaumont',
    likedOrDisliked: 'Liked',
    characteristics: [
      'Peaceful',
      'Tons of old growth trees and benches',
      'Great for walking, jogging, picnic, or just sitting and relaxing',
      'Like a mini version of Central Park in New York',
    ],
  },
  {
    experience: 'Spirited Away: breathtakingly beautiful.',
    aboutEntity: 'Spirited Away',
    likedOrDisliked: 'Liked',
    characteristics: ['Visually stunning', 'Great story', 'Heartwarming'],
  },
];

const experienceTemplEntries: ExperienceTemplEntry[] = criteriaPoints.map(
  (item) => {
    const { experience, aboutEntity, likedOrDisliked } = item;
    const characteristics = characteristicsTempl.apply(
      item.characteristics.map((s) => {
        return { characteristic: s };
      })
    ).escaped;
    return {
      experience,
      aboutEntity,
      likedOrDisliked,
      characteristics,
    };
  }
);

const itemExperienceTempl = template`<short-experience-description>${nv(
  'experience'
)}</short-experience-description>
<entity-name>${nv('aboutEntity')}</entity-name>
<liked-or-disliked>${nv('likedOrDisliked')}</liked-or-disliked>
<what-there-is-to-like-or-dislike-about-entity>
  ${nv('characteristics')}
</what-there-is-to-like-or-dislike-about-entity>`;

const itemExperiencesTempl = new FewShotTemplate(itemExperienceTempl, '\n\n');

const itemInterpreterTempl = template`Given a short description of an experience, identify what it is about (write "Entity: and name the thing being written about (and give some details about what kind of thing it is, e.g. movie by director name)"). If the author likes it (write "Liked") or not (write "Disliked"), and then list the key characteristics that might be why they liked or disliked it.

${nv('pastExperiences')}

${itemExperienceTempl as Template<string>}`;

// Example usage.
const pastFewShotItemExperiences = itemExperiencesTempl.apply(
  experienceTemplEntries
);

export const expInterpTempl = itemInterpreterTempl.substs({
  pastExperiences: pastFewShotItemExperiences.escaped,
  // experience: 'The Garden of Forking Paths: like it'
});
