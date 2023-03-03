import React, { useMemo } from 'react';
import ContextMenu, { Position } from 'devextreme-react/context-menu';
import List from 'devextreme-react/list';
import { useAuth } from '../../contexts/auth';
import './UserPanel.scss';


export default function UserPanel({ menuMode }) {
  const { user, signOut } = useAuth();
  const menuItems = useMemo(() => ([
    {
      text: 'Logout',
      icon: 'runner',
      onClick: signOut
    }
  ]), [signOut]);

  return (
    <div className={'user-panel'}>
      <div className={'user-info'}>
        <div className={'image-container'}>
          <div
            style={{
              background: `url(https://ui-avatars.com/api/?name=${user.username}&background=FFF&color=363640) no-repeat #fff`,
              backgroundSize: 'cover'
            }}
            className={'user-image'} />
        </div>
        <div className={'user-name'}>{user.username}</div>
      </div>

      {menuMode === 'context' && (
        <ContextMenu
          items={menuItems}
          target={'.user-button'}
          showEvent={'dxclick'}
          width={210}
          cssClass={'user-menu'}
        >
          <Position my={'top center'} at={'bottom center'} />
        </ContextMenu>
      )}
      {menuMode === 'list' && (
        <List className={'dx-toolbar-menu-action'} items={menuItems} />
      )}
    </div>
  );
}
