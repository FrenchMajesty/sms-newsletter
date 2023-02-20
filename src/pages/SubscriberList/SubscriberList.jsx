// Create a new page in src/pages/SubscriberList/SubscriberList.jsx similar to Home.jsx
import React from 'react';
import './SubscriberList.css';
import {
  Input,
  Row,
  Col,
  Form,
  Button,
  Typography,
  Space,
  DatePicker,
  TimePicker,
  message,
  List,
} from 'antd';
import ParseToHTML from 'html-react-parser';
import { debounce } from 'lodash';
import moment from 'moment';
import HeaderBar from '../../components/HeaderBar/HeaderBar';
import { useNavigate, Link } from 'react-router-dom';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from 'lib/firebase';
import algoliasearch from 'algoliasearch/lite';
import useAlgolia from 'use-algolia';
import { InstantSearch, SearchBox } from 'react-instantsearch-hooks-web';

const REACT_APP_ALGOLIA_APP_ID = 'F7IPCQJFCH';
const REACT_APP_ALGOLIA_SEARCH_KEY = '11700f6a95e0d3da5899191bb02bd2fd';
const REACT_APP_ALGOLIA_INDEX = 'dev_subscriberlist';

const SubscriberList = () => {
  const [loading, setLoading] = React.useState(false);
  const [qLimit, setLimit] = React.useState(15);
  const [data, setData] = React.useState([]);
  const [searchState, requestDispatch] = useAlgolia(
    REACT_APP_ALGOLIA_APP_ID,
    REACT_APP_ALGOLIA_SEARCH_KEY,
    REACT_APP_ALGOLIA_INDEX,
  );
  const { hits, loading: searchLoading, request } = searchState;
  console.log(searchState);
  const onSearchChange = (e) => {
    // TODO: Debounce this
    triggerSearch(e.target.value);
  };
  const triggerSearch = React.useRef(
    debounce((query) => {
      query = query.trim();
      requestDispatch({ query });
    }, 200),
  ).current;
  const userAccount = JSON.parse(localStorage.getItem('account') || '{}');
  const fetchSubscribers = React.useCallback(async () => {
    try {
      setLoading(true);
      //  TODO: Remove hardcoded account ID
      const q = query(
        collection(db, '/Accounts/JQ2U2j0TF7okzqqZOy4I/subscribers'),
        orderBy('created_at', 'desc'),
        limit(qLimit),
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: '/' + doc.ref.path,
        uid: doc.id,
        ...doc.data(),
      }));
      setLoading(false);
      setData(data);
    } catch (e) {
      console.log(e);
      setLoading(false);
      message.error('Error fetching subscribers list :(');
    }
  }, [qLimit]);
  const formatPhoneNumber = (number) => {
    const cleaned = ('' + number).replace(/\D/g, '');
    const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      const intlCode = match[1] ? '+1 ' : '';
      return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
    }
    return 'N/A';
  };
  const hasMoreToLoad = React.useMemo(() => {
    return userAccount ? userAccount.subscribers_count > data.length : false;
  }, [userAccount, data.length]);
  const isSearching = request.query && request.query.length > 2;
  const onLoadMore = () => {
    setLimit(qLimit + 20);
  };
  const getHighlightedText = (hit, key) => {
    try {
      const highlighted = hit._highlightResult[key].value;
      return ParseToHTML(highlighted);
    } catch (e) {
      return hit[key];
    }
  };
  React.useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const loadMore =
    data.length > 0 && !loading && hasMoreToLoad ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 18,
          marginBottom: 18,
          height: 32,
          lineHeight: '32px',
        }}
      >
        <Button onClick={onLoadMore}>Load more</Button>
      </div>
    ) : null;

  return (
    <div>
      <HeaderBar title="Subscriber List" />
      <Col span={24} className="home-container subscriber-page">
        <Row gutter={16}>
          <Col span={24}>
            <Input.Search
              placeholder="Search by name"
              size="large"
              loading={false}
              onChange={onSearchChange}
              onSearch={triggerSearch}
            />
          </Col>
        </Row>
        <Space style={{ marginTop: 16, marginBottom: 16 }}>
          <Link to="/subscribers/add">
            <Button>Add</Button>
          </Link>
        </Space>
        {isSearching ? (
          <List
            itemLayout="horizontal"
            dataSource={hits}
            loading={loading}
            loadMore={loadMore}
            locale={{ emptyText: 'No results found' }}
            className="subscriber-list"
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <Link to={`/subscribers/${item.uid}`}>
                      {getHighlightedText(item, 'name')}
                    </Link>
                  }
                  description={`${formatPhoneNumber(
                    item.phone_number,
                  )} - Added ${moment(item.created_at).format('MMM Do, YYYY')}`}
                />
              </List.Item>
            )}
          />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={data}
            loading={loading}
            loadMore={loadMore}
            locale={{ emptyText: 'No subscribers found' }}
            className="subscriber-list"
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <Link to={`/subscribers/${item.uid}`}>{item.name}</Link>
                  }
                  description={`${formatPhoneNumber(
                    item.phone_number,
                  )} - Added ${moment(item.created_at).format('MMM Do, YYYY')}`}
                />
              </List.Item>
            )}
          />
        )}
      </Col>
    </div>
  );
};

export default SubscriberList;
