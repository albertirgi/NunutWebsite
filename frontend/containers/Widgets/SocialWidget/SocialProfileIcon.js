import React from 'react';

export default function SocialProfileIcon({ url, icon }) {
  return (
    <li>
      <a href={url}>{icon}</a>
    </li>
  );
}
