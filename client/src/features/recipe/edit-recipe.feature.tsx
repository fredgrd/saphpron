import React, { useState, useRef, useContext } from 'react';
import { ToastContext } from '../../context/tost.context';
import RecipeService from '../../services/recipe.service';
import CloudinaryService from '../../services/cloudinary.service';
import { Recipe } from '../../models/recipe.model';
import './recipe-infos.feature.css';

import ImagePreview from '../../assets/image-preview.png';
import SimpleInput from '../../components/simple-input/simple-input.component';
import BigButton from '../../components/big-button/big-button.component';

import { ReactComponent as Bookmark } from '../../assets/bookmark.svg';
import { ReactComponent as BookmarkSelected } from '../../assets/bookmark-selected.svg';

const EditRecipe: React.FC<{
  recipe: Recipe;
  set: (recipe: Recipe) => void;
}> = ({ recipe, set }) => {
  const [editing, setEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File>();
  const [name, setName] = useState<string>(recipe.name);
  const [description, setDescription] = useState<string>(recipe.description);
  const [time, setTime] = useState<number>(recipe.prep_time);
  const [favourite, setFavourite] = useState<boolean>(recipe.is_favourite);
  const [cloudinaryService] = useState<CloudinaryService>(
    new CloudinaryService()
  );
  const [recipeService] = useState<RecipeService>(new RecipeService());
  const toastContext = useContext(ToastContext);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (loading) return;

    if (!event.target.files || !event.target.files.length) {
      return;
    }

    const file: File = event.target.files[0];
    setImageFile(file);
  };

  const onSave = async () => {
    if (loading) return;
    setLoading(true);

    if (imageFile) {
      var { url, error: cloudinaryError } = await cloudinaryService.uploadImage(
        imageFile!
      );

      if (cloudinaryError) {
        setLoading(false);
        toastContext.update({
          isVisible: true,
          message: `Error creating recipe: ${cloudinaryError}`,
        });
        return;
      }

      if (!url) {
        setLoading(false);
        toastContext.update({
          isVisible: true,
          message: 'Error creating recipe',
        });
        return;
      }
    }

    const { recipe: updatedRecipe, error } = await recipeService.update(
      recipe.id,
      {
        name,
        description,
        prep_time: time,
        media_url: url,
        is_favourite: favourite,
      }
    );

    if (error) {
      setLoading(false);
      toastContext.update({
        isVisible: true,
        message: `Error creating recipe: ${error}`,
      });
      return;
    }

    if (!updatedRecipe) {
      setLoading(false);
      toastContext.update({
        isVisible: true,
        message: 'Error creating recipe',
      });
      return;
    }

    setImageFile(undefined);
    setEditing(false);
    setLoading(false);
    set(updatedRecipe);
  };

  const onEdit = () => {
    if (editing) {
      // RESET Values
      setName(recipe.name);
      setDescription(recipe.description);
      setTime(recipe.prep_time);
      setFavourite(recipe.is_favourite);
      setImageFile(undefined);
      setEditing(false);
    } else {
      setEditing(true);
    }
  };

  return (
    <div className="recipeinfos">
      <div className="recipeinfos__header">INFOS</div>
      <div className="recipeinfos__container">
        <div
          className="recipeinfos__image"
          style={{ cursor: editing ? 'pointer' : 'auto' }}
          onClick={() => imageInputRef.current?.click()}
        >
          <input
            type="file"
            accept="image"
            ref={imageInputRef}
            style={{ display: 'none' }}
            onChange={onSelectImage}
            disabled={!editing}
          />
          <img
            className="recipeinfos__image__preview"
            src={
              imageFile
                ? URL.createObjectURL(imageFile)
                : recipe.media_url.length > 0
                ? recipe.media_url
                : ImagePreview
            }
          />
        </div>
        <div className="recipeinfos__info">
          <div style={{ marginBottom: '15px' }}>
            <SimpleInput
              onChange={setName}
              value={name}
              options={{ title: 'Name', type: 'text', isDisabled: !editing }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <SimpleInput
              onChange={setDescription}
              value={description}
              options={{
                title: 'Description',
                type: 'text',
                isDisabled: !editing,
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <SimpleInput
              onChange={(time) => setTime((time as number) > 0 ? time : 1)}
              value={time}
              options={{
                title: 'Preparation time',
                type: 'number',
                isDisabled: !editing,
              }}
            />
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <BigButton
          title={editing ? 'CLOSE' : 'EDIT'}
          isLoading={false}
          onClick={onEdit}
        />
        {editing && (
          <BigButton title="SAVE" isLoading={loading} onClick={onSave} />
        )}
      </div>
      <button
        className="recipeinfos__bookmark"
        disabled={!editing}
        onClick={() => setFavourite((state) => !state)}
      >
        {favourite ? <BookmarkSelected /> : <Bookmark />}
      </button>
    </div>
  );
};

export default EditRecipe;
