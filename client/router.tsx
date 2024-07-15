import React, { FC, ReactNode, useEffect } from 'react';
import { createHashRouter } from 'react-router-dom';
import Chat from '@/pages/chat';

interface TProps {
  children: ReactNode;
  title: string;
}

const WithDocumentTitle: FC<TProps> = (props) => {
  const { title, children } = props;

  useEffect(() => {
    document.title = title;
  }, [title]);

  return <>{children}</>;
};

const router = createHashRouter([
  {
    path: '/',
    // element: (
    //   <WithDocumentTitle title='AIChat'>
    //     <Chat />
    //   </WithDocumentTitle>
    // ),
    children: [
      {
        path: 'chat',
        index: true,
        element: (
          <WithDocumentTitle title="AIChat">
            <Chat />
          </WithDocumentTitle>
        ),
      },
    ],
  },
]);

export default router;
