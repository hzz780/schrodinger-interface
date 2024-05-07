import { getRankList } from 'api/request';
import { useCallback, useState } from 'react';
import { useEffectOnce } from 'react-use';
import useLoading from 'hooks/useLoading';
import { IKOLRulesSection, IRankList, IRankListPageConfig, IRulesSection } from 'redux/types/reducerTypes';
import RankList from './components/RankList';
import AwardAnnouncement from './components/AwardAnnouncement';

export default function PointsPage() {
  const { showLoading, closeLoading, visible } = useLoading();

  const [showAnnouncement, setShowAnnouncement] = useState<boolean>(false);

  const [list, setList] = useState<IRankList[]>([]);
  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string[]>();
  const [rulesTitle, setRulesTitle] = useState<string>();
  const [rulesList, setRulesList] = useState<string[]>();
  const [rulesSection, setRulesSection] = useState<IRulesSection>();
  const [kolRulesSection, setKolRulesSection] = useState<IKOLRulesSection>();
  const [subdomain, setSubdomain] = useState<{
    title?: string;
    description?: string[];
    list?: (IRankList & {
      link: string;
    })[];
  }>();
  const [pageConfig, setPageConfig] = useState<IRankListPageConfig>();

  const rankList = useCallback(async () => {
    showLoading();
    const { data } = await getRankList();
    closeLoading();
    setShowAnnouncement(!!data?.pageConfig?.showAnnouncement);
    setList(data.lp.list);
    setDescription(data.lp.description);
    setTitle(data.lp.title);
    setRulesTitle(data.lp.rules?.title);
    setRulesList(data.lp.rules?.rulesList);
    setPageConfig(data.pageConfig);
    setRulesSection(data.lp.rules?.rulesSection);
    setKolRulesSection(data.lp.rules?.kolRulesSection);
    setSubdomain(data?.subdomain);
  }, [closeLoading, showLoading]);

  useEffectOnce(() => {
    rankList();
  });
  return showAnnouncement ? (
    <AwardAnnouncement
      pageConfig={pageConfig}
      rulesList={rulesList}
      rulesTitle={rulesTitle}
      rulesSection={rulesSection}
      kolRulesSection={kolRulesSection}
      title={title}
      description={description}
      list={list}
      loadingVisible={visible}
      subdomain={subdomain}
    />
  ) : (
    <RankList
      pageConfig={pageConfig}
      rulesList={rulesList}
      rulesTitle={rulesTitle}
      rulesSection={rulesSection}
      kolRulesSection={kolRulesSection}
      title={title}
      description={description}
      list={list}
      loadingVisible={visible}
      subdomain={subdomain}
    />
  );
}
