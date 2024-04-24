/* eslint-disable react/no-unescaped-entities */
import React from 'react';

const textStyle = 'text-base font-medium text-neutralSecondary mt-[8px] mb-[16px]';

function RulesList() {
  return (
    <>
      <span className={textStyle}>
        With the launch of $SGR Liquidity Drive, we are offering you the chance to receive airdrops from a pool of
        18,000 $SGR. You can participate in this campaign by contributing liquidity to our $SGR/ELF liquidity pool on
        AwakenSwap. All you have to do is visit:
        <a
          href="https://awaken.finance/trading/SGR-1_ELF_3"
          className="text-brandDefault"
          target="_blank"
          rel="noreferrer">
          https://awaken.finance/trading/SGR-1_ELF_3
        </a>
        , and click "Add Liquidity" to contribute to our $SGR/ELF liquidity pool.
      </span>
      <span className={textStyle}>
        Every $1 of provided liquidity during the campaign duration earns you 99 points per day, and daily snapshots
        will be taken to track your contributions. These daily points accumulated will count your total points. When the
        campaign ends on 29 April 2024, the top 40 participants, ranked by total points accumulated during the campaign
        duration, will share the pool of 16,000 $SGR tokens.
      </span>
      <span className={textStyle}>
        An additional 2,000 $SGR tokens will be distributed among participants who use their personalised Project
        Schrodinger link to invite friends and community members to contribute to the $SGR/ELF liquidity pool on
        AwakenSwap. Each contribution made through your link earns you points, and the top 8 participants with the most
        points will share the 2,000 $SGR token pool. If you don't have a personalised link for Project Schrodinger, you
        can apply via:
        <a
          href=" https://pixiepoints.io/apply/Schr%C3%B6dinger"
          className="text-brandDefault"
          target="_blank"
          rel="noreferrer">
          https://pixiepoints.io/apply/Schrödinger
        </a>
      </span>
      <span className={textStyle}>
        Don't miss out on this airdrop and start contributing to our $SGR/ELF liquidity pool now!
      </span>
      <span className={textStyle}>The campaign runs from 19 April until 29 April 2024.</span>
    </>
  );
}

export default React.memo(RulesList);
